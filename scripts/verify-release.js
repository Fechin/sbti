"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { execFileSync, spawn } = require("node:child_process");

const repoRoot = path.join(__dirname, "..");
const packageJson = require(path.join(repoRoot, "package.json"));
const packageName = packageJson.name;

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    ...options
  }).trim();
}

function runIn(cwd, command, args, options = {}) {
  return execFileSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    ...options
  }).trim();
}

function runAsyncIn(cwd, command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env: options.env ?? process.env,
      stdio: ["ignore", "pipe", "pipe"]
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve(stdout.trim());
        return;
      }

      const error = new Error(stderr.trim() || stdout.trim() || `${command} exited with code ${code}`);
      error.code = code;
      reject(error);
    });
  });
}

function extractTarballName(output) {
  const lines = output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const tarballLine = [...lines].reverse().find((line) => line.endsWith(".tgz"));

  assert.ok(tarballLine, "npm pack should print a tarball filename");
  return tarballLine;
}

function hasCommand(command) {
  try {
    execFileSync("which", [command], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    });
    return true;
  } catch {
    return false;
  }
}

function contentType(filePath) {
  if (filePath.endsWith(".json")) {
    return "application/json; charset=utf-8";
  }
  if (filePath.endsWith(".yaml") || filePath.endsWith(".yml")) {
    return "text/yaml; charset=utf-8";
  }
  return "text/plain; charset=utf-8";
}

async function createStaticServer(rootDir) {
  const server = http.createServer(async (request, response) => {
    const requestUrl = new URL(request.url, "http://127.0.0.1");
    const requestedPath = decodeURIComponent(requestUrl.pathname);
    const targetPath = path.join(rootDir, requestedPath);

    if (!targetPath.startsWith(rootDir)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    try {
      const stat = await fsp.stat(targetPath);
      if (stat.isDirectory()) {
        response.writeHead(404);
        response.end("Not Found");
        return;
      }

      response.writeHead(200, {
        "content-type": contentType(targetPath)
      });
      fs.createReadStream(targetPath).pipe(response);
    } catch {
      response.writeHead(404);
      response.end("Not Found");
    }
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();
  return {
    close: () =>
      new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve()))),
    url: `http://127.0.0.1:${address.port}`
  };
}

async function main() {
  const tempRoot = await fsp.mkdtemp(path.join(os.tmpdir(), "sbti-release-"));
  const packageDir = path.join(tempRoot, "package-test");
  const skillDir = path.join(tempRoot, "skill-test");
  const tarballName = `${packageName
    .replace(/^@/, "")
    .replace(/\//g, "-")}-${packageJson.version}.tgz`;
  const tarballPath = path.join(repoRoot, tarballName);
  let server;

  try {
    await fsp.mkdir(packageDir, { recursive: true });
    await fsp.mkdir(skillDir, { recursive: true });

    console.log("1. Running lint and unit tests");
    run("npm", ["run", "lint"]);
    run("npm", ["test"]);

    console.log("2. Packing npm tarball");
    const packedTarballName = extractTarballName(run("npm", ["pack"]));
    assert.equal(packedTarballName, tarballName);
    assert.equal(fs.existsSync(tarballPath), true, "tarball should exist after pack");

    console.log("3. Installing packed tarball into clean directory");
    runIn(packageDir, "npm", ["init", "-y"]);
    runIn(packageDir, "npm", ["install", tarballPath]);

    console.log("4. Verifying installed package API");
    const apiSmoke = runIn(packageDir, process.execPath, [
      "-e",
      [
        `const {runTest, answersFromPattern} = require('${packageName}');`,
        "(async () => {",
        "const result = await runTest({language:'en', answers: answersFromPattern('HHH-HMH-MHH-HHH-MHM'), specialAnswers:[1,1]});",
        "console.log(JSON.stringify({personality: result.personality, score: result.score}));",
        "})();"
      ].join("")
    ]);
    assert.deepEqual(JSON.parse(apiSmoke), { personality: "CTRL", score: 100 });

    console.log("5. Verifying installed CLI");
    const cliSmoke = runIn(packageDir, "npx", ["sbti", "--preset", "DRUNK", "--lang", "en", "--json"]);
    const cliPayload = JSON.parse(cliSmoke);
    assert.equal(cliPayload.personality, "DRUNK");
    assert.equal(cliPayload.reason, "special:drunk");

    if (hasCommand("expect")) {
      console.log("5.1 Verifying interactive CLI with a real TTY");
      const interactiveAnswers = [
        3, 3, 3, 3, 3, 3, 3, 3, 1, 3,
        3, 3, 1, 3, 3, 3, 3, 3, 3, 3,
        3, 3, 3, 3, 1, 3, 3, 3, 1, 3,
        1, 1
      ];
      const expectScript = [
        "set timeout 20",
        "spawn npx sbti --lang en",
        `set answers {${interactiveAnswers.join(" ")}}`,
        "foreach answer $answers {",
        "  expect \"> \"",
        "  send \"$answer\\r\"",
        "}",
        "expect {",
        "  \"CTRL · Controller\" {}",
        "  timeout { exit 1 }",
        "}",
        "expect eof"
      ].join("\n");

      const interactiveSmoke = runIn(packageDir, "expect", ["-c", expectScript]);
      assert.match(interactiveSmoke, /CTRL · Controller/);
    }

    console.log("6. Verifying skill installation via public skill CLI");
    server = await createStaticServer(repoRoot);
    await runAsyncIn(skillDir, "npx", ["-y", "skill", "skills/sbti"], {
      env: {
        ...process.env,
        SKILL_BASE_URL: server.url
      }
    });

    const installedSkill = path.join(skillDir, ".codebuddy", "skills", "sbti");
    assert.equal(fs.existsSync(path.join(installedSkill, "SKILL.md")), true);
    assert.equal(
      fs.existsSync(path.join(installedSkill, "agents", "openai.yaml")),
      true
    );

    console.log("Release verification passed");
  } finally {
    if (server) {
      await server.close();
    }
    await fsp.rm(tempRoot, { recursive: true, force: true });
    await fsp.rm(tarballPath, { force: true });
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
