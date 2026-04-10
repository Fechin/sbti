#!/usr/bin/env node

const { runCli } = require("../src/cli");

runCli().catch((error) => {
  console.error(`sbti: ${error.message}`);
  process.exit(1);
});
