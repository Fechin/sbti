# 🚀 SBTI Test Skill - 快速参考指南

## ⚡ 30 秒快速开始

```bash
# 安装
npx add @fechin/sbti-test-skill

# 运行测试
npx sbti-test

# 或在 Node.js 中使用
node -e "const {runTest} = require('@fechin/sbti-test-skill'); runTest();"
```

---

## 📦 NPM 包信息

| 属性 | 值 |
|------|-----|
| 包名 | `@fechin/sbti-test-skill` |
| 版本 | v2.0.0 |
| GitHub | https://github.com/Fechin/sbti-test-skill |
| License | MIT |
| 最低 Node 版本 | 16+ |

---

## 🎯 核心 API

### `runTest(options)`
启动交互式测试

```typescript
import { runTest } from '@fechin/sbti-test-skill';

const result = await runTest({
  language: 'zh-Hans' | 'zh-Hant' | 'en',
  verbose: false,
  colorize: true
});

// 返回: TestResult
// {
//   personality: "CTRL",
//   personalityName: "拿捏者",
//   score: 87,
//   vector: "HHH-HMH-MHH-HHH-MHM",
//   dimensions: { S1: "H", S2: "H", ... },
//   matchedType: { ... },
//   topMatches: [ ... ]
// }
```

### `SBTITest` 类
编程式使用

```typescript
import { SBTITest } from '@fechin/sbti-test-skill';

const test = new SBTITest({ language: 'zh-Hans' });

// 获取问题
const questions = test.getQuestions();

// 提交答案
test.submitAnswer('q1', 3);
test.submitAnswer('q2', 2);
// ... 继续 30 题

// 计算结果
const result = test.calculateResult();

// 获取详细报告
const report = test.getResultReport();
```

---

## 🧠 15 个人格维度

| 维度代码 | 名称 | 模型 | L (低) | M (中) | H (高) |
|---------|------|------|--------|--------|--------|
| **S1** | 自尊自信 | 自我 | 自卑 | 波动 | 自信 |
| **S2** | 自我清晰 | 自我 | 模糊 | 尚可 | 清晰 |
| **S3** | 核心价值 | 自我 | 懒散 | 平衡 | 进取 |
| **E1** | 依恋安全 | 情感 | 不安 | 尚可 | 信任 |
| **E2** | 情感投入 | 情感 | 冷漠 | 平衡 | 深陷 |
| **E3** | 边界依赖 | 情感 | 粘人 | 平衡 | 独立 |
| **A1** | 世界观 | 态度 | 悲观 | 平衡 | 善意 |
| **A2** | 规则灵活 | 态度 | 叛逆 | 平衡 | 守规 |
| **A3** | 人生意义 | 态度 | 虚无 | 平衡 | 有义 |
| **Ac1** | 动机导向 | 行动 | 避险 | 平衡 | 追求 |
| **Ac2** | 决策风格 | 行动 | 犹豫 | 平衡 | 果断 |
| **Ac3** | 执行模式 | 行动 | 拖延 | 平衡 | 主动 |
| **So1** | 社交主动 | 社交 | 内向 | 平衡 | 热情 |
| **So2** | 人际边界 | 社交 | 融合 | 平衡 | 边界 |
| **So3** | 表达真实 | 社交 | 直接 | 平衡 | 伪装 |

---

## 🎭 27 种人格类型

### 25 种标准人格

| 代码 | 中文名 | 特点简述 |
|------|--------|----------|
| **CTRL** | 拿捏者 | 自信、掌控、决策力强 |
| **MALO** | 吗喽 | 追随者、依赖、易影响 |
| **FAKE** | 伪人 | 两面派、适应能力强 |
| **MUM** | 妈妈 | 照顾他人、牺牲自我 |
| **LOVE-R** | 多情者 | 热恋脑、深情、投入高 |
| **GOGO** | 行者 | 行动派、冒险精神 |
| **SEXY** | 尤物 | 魅力、社交、独特风格 |
| **BOSS** | 领导者 | 权力欲、组织能力 |
| **ATM-er** | 送钱者 | 慷慨、无底线关怀 |
| **THAN-K** | 感恩者 | 知足、感恩、简朴 |
| **OH-NO** | 哦不人 | 焦虑、敏感、脆弱 |
| **WOC!** | 握草人 | 愤怒、失控、冲动 |
| **THIN-K** | 思考者 | 理性、分析、冷静 |
| **SHIT** | 愤世者 | 愤怒、厌世、反抗 |
| **POOR** | 贫困者 | 不幸、努力、挣扎 |
| **ZZZZ** | 装死者 | 逃避、沉默、被动 |
| **JOKE-R** | 小丑 | 自嘲、搞笑、自贬 |
| **OJBK** | 无所谓人 | 随意、不关心 |
| **SOLO** | 孤儿 | 孤独、疏离、自闭 |
| **MONK** | 僧人 | 清苦、禁欲、独立 |
| **IMSB** | 傻者 | 呆萌、天真、迟钝 |
| **FUCK** | 草者 | 放纵、破坏、无序 |
| **DEAD** | 死者 | 抑郁、无望、麻木 |
| **IMFW** | 废物 | 自暴自弃、无能 |
| **Dior-s** | 屌丝 | 底层、逆袭、坚持 |

### 2 种特殊人格

| 代码 | 中文名 | 触发条件 |
|------|--------|---------|
| **DRUNK** | 酒鬼 | 隐藏彩蛋：选择"饮酒" + "白酒当白开水喝" |
| **HHHH** | 傻乐者 | 兜底人格：与所有标准人格匹配度都 < 60% |

---

## 📊 结果示例

```json
{
  "personality": "CTRL",
  "personalityName": "拿捏者",
  "score": 87,
  "vector": "HHH-HMH-MHH-HHH-MHM",
  "dimensions": {
    "S1": "H",
    "S2": "H",
    "S3": "H",
    "E1": "H",
    "E2": "M",
    "E3": "H",
    "A1": "M",
    "A2": "H",
    "A3": "H",
    "Ac1": "H",
    "Ac2": "H",
    "Ac3": "H",
    "So1": "M",
    "So2": "H",
    "So3": "M"
  },
  "matchedType": {
    "code": "CTRL",
    "name": "拿捏者",
    "description": "你是一个全能型人格...",
    "traits": ["领导力", "掌控", "自信", "决断力"],
    "shareableText": "我是 CTRL 拿捏者，搞定一切靠的就是这份定力。",
    "similarity": 87
  },
  "topMatches": [
    { "code": "GOGO", "name": "行者", "similarity": 85 },
    { "code": "BOSS", "name": "领导者", "similarity": 82 },
    { "code": "MALO", "name": "吗喽", "similarity": 65 }
  ],
  "timestamp": "2026-04-10T10:30:00.000Z"
}
```

---

## 💻 代码示例

### 简单使用

```javascript
// CommonJS
const { runTest } = require('@fechin/sbti-test-skill');

(async () => {
  const result = await runTest({ language: 'zh-Hans' });
  console.log(`你是 ${result.personality} 人格！`);
  console.log(`匹配度: ${result.score}%`);
})();
```

### React 集成

```jsx
import React, { useState } from 'react';
import { SBTITestWidget } from '@fechin/sbti-test-skill/react';

export default function PersonalityTest() {
  const [result, setResult] = useState(null);

  return (
    <div>
      {!result ? (
        <SBTITestWidget 
          language="zh-Hans"
          onComplete={setResult}
        />
      ) : (
        <div>
          <h1>你是 {result.personalityName}</h1>
          <p>匹配度: {result.score}%</p>
          <p>分享: {result.matchedType.shareableText}</p>
          <button onClick={() => setResult(null)}>重新测试</button>
        </div>
      )}
    </div>
  );
}
```

### 编程式使用

```typescript
import { SBTITest } from '@fechin/sbti-test-skill';
import questionBank from '@fechin/sbti-test-skill/data/question-bank.json';

const test = new SBTITest({
  language: 'zh-Hans',
  questions: questionBank.questions,
  types: questionBank.types,
  specialQuestions: questionBank.specialQuestions,
  dimensionMeta: questionBank.dimensionMeta,
  verbose: true
});

const questions = test.getQuestions();

// 模拟答题
questions.forEach((q, idx) => {
  const answer = ((idx % 3) + 1) as 1 | 2 | 3;
  test.submitAnswer(q.id, answer);
});

const result = test.calculateResult();
const report = test.getResultReport();

console.log('Personality:', result.personality);
console.log('Score:', result.score);
console.log('Dimension Explanations:', report.dimensionExplanations);
```

---

## 🌍 语言支持

### 支持的语言

```
✅ zh-Hans  - 简体中文 (默认)
✅ zh-Hant  - 繁體中文
✅ en       - English
```

### 使用不同语言

```javascript
// 简体中文
await runTest({ language: 'zh-Hans' });

// 繁體中文
await runTest({ language: 'zh-Hant' });

// English
await runTest({ language: 'en' });
```

---

## 🔧 自定义选项

### runTest() 选项

```typescript
interface RunTestOptions {
  language?: 'zh-Hans' | 'zh-Hant' | 'en';  // 语言 (默认: 'zh-Hans')
  verbose?: boolean;                         // 显示详细日志
  colorize?: boolean;                        // 彩色输出 (默认: true)
  interactive?: boolean;                     // 交互模式 (默认: true)
  questions?: Question[];                    // 自定义题库
  types?: PersonalityType[];                 // 自定义人格库
  specialQuestions?: Question[];             // 自定义隐藏题
}
```

### SBTITest 选项

```typescript
interface SBTITestOptions {
  language?: Language;                       // 语言
  questions?: Question[];                    // 自定义题库
  types?: PersonalityType[];                 // 自定义人格库
  specialQuestions?: Question[];             // 自定义隐藏题
  dimensionMeta?: Record<DimensionCode, DimensionMeta>;  // 维度元数据
  verbose?: boolean;                         // 详细日志
}
```

---

## 📱 三语言 README 链接

- **简体中文**: `README.md`
- **繁体中文**: `README_ZH_HANT.md`
- **English**: `README_EN.md`

---

## 🔗 重要链接

| 链接 | URL |
|------|-----|
| GitHub | https://github.com/Fechin/sbti-test-skill |
| NPM | https://npmjs.com/package/@fechin/sbti-test-skill |
| Issues | https://github.com/Fechin/sbti-test-skill/issues |
| Discussions | https://github.com/Fechin/sbti-test-skill/discussions |

---

## 📝 常见问题

### Q: 结果准确吗？
A: SBTI 是娱乐性测试，结果仅供娱乐和自我反思，不应作为临床诊断。

### Q: 可以自定义人格类型吗？
A: 可以，编辑 `data/question-bank.json` 或传入自定义 `types` 数组。

### Q: 如何添加新语言？
A: 在所有文本字段中添加新语言代码，例如 `"ja": "..."`。

### Q: 支持离线使用吗？
A: 完全支持，这是一个纯客户端工具，无需网络连接。

### Q: 数据会被保存或上传吗？
A: 不会，所有计算都在客户端进行，不涉及服务器通信。

---

## 📊 统计信息

- **代码行数**: ~810
- **问题数**: 32 (30 标准 + 2 隐藏)
- **人格类型**: 27
- **人格维度**: 15
- **支持语言**: 3
- **包大小**: ~95 KB
- **零运行时依赖**: 是

---

## ⚖️ License

MIT License - 完全开源，自由使用、修改、分发

---

**最后更新**: 2026-04-10  
**版本**: v2.0.0
