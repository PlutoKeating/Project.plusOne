# 📖 序章：加一的诞生

## 故事背景

2018 年，研究者 **PlutoKeating** 启动了一个新项目：打造一个全方位的智能助手。他在白板上写下它的名字 **加一（plusOne）**，意思是每天进步一点、每次迭代多一分能力。

加一需要学会三件事：

1. **理解人类语言**：看懂用户想要什么。
2. **从知识库查资料**：基于真实资料回答，不瞎编。
3. **调用外部工具**：除了回答问题，还能动手完成任务。

加一的每一步成长，都对应你作为开发者要掌握的一项技能。学完本教程，加一会从一个只会打印 "Hello World" 的程序，长成能查资料、调 API、记住上下文、独立完成任务的助手；你也能独立搭建 RAG 系统、设计 Agent 工作流。

---

## 学习地图：加一的成长路线

```text
第 1 章  🧱 给加一一个身体      Python 基础
   │
第 2 章  👁️ 加一睁开双眼        第一次 LLM API 调用
   │
第 3 章  📚 加一学会读书        RAG 检索增强生成
   │
第 4 章  🖐️ 加一学会动手        Agent 核心循环
   │
第 5 章  🧰 加一的工具箱        Tool / MCP / Memory
   │
第 6 章  👥 加一的团队          Multi-Agent
   │
第 7 章  🚀 加一毕业了          项目实战 & 面试
```

每章结束时，你能说清这一阶段的加一由哪几块组成、数据怎么流动。

---

## 如何使用本教程

| 你的基础 | 建议起点 |
|----------|----------|
| 零编程基础 | 从第 1 章按顺序读，每章的示例都在自己电脑上跑一遍 |
| 会一些 Python | 快速扫一眼第 1 章，从第 2 章开始 |
| 调用过 LLM API | 可跳到第 3 或第 4 章，前面的故事设定建议看一下，全书剧情连贯 |

### 教学方式：最小可行知识

本教程借鉴 [fast.ai](https://course.fast.ai/) 创始人 Jeremy Howard 的做法：先让学习者做出东西，再回头理解原理。[freeCodeCamp](https://www.freecodecamp.org/) 等社区的实践也表明，先拿到可运行的成果，更容易坚持学下去。每章你先跑通一个能用的东西，再看它为什么能用。

> **"AI is the new electricity. Just as electricity transformed almost everything 100 years ago, today I have a hard time thinking of an industry that I don't think AI will transform in the next several years."**
> — Andrew Ng，Coursera 联合创始人、斯坦福大学教授

---

## 🤖 AI 辅助学习

本教程鼓励你全程用 AI 辅助学习。会和 AI 协作，本身就是开发者的核心技能。每章末尾有 **"🤖 向 AI 提问"** 板块，提供推荐问法和 Prompt 模板，例如：

> **Prompt 模板：**
> ```
> 角色：你是一个耐心的 Python 导师
> 任务：解释 [概念] 并给出 3 个代码示例
> 约束：面向零编程基础的初学者，少用专业术语，多用生活类比
> ```

---

## 开始前的准备

- [ ] **Python 3.10+**：到 [python.org](https://python.org) 下载安装
- [ ] **代码编辑器**：推荐 VS Code
- [ ] **一个 OpenAI 兼容的 API Key**：OpenAI、Azure OpenAI 或其他兼容的第三方服务均可

加一在等你。

---

## 📚 本章参考资料

> *本教程是对作者原始博客文章的改写与重构。原作者的分享精神激发了加一的诞生，在此致谢。*

- [fast.ai — Practical Deep Learning for Coders](https://course.fast.ai/) — 免费深度学习课程，Jeremy Howard 主讲的"做中学"典范
- [freeCodeCamp](https://www.freecodecamp.org/) — 全球最大的免费编程学习社区之一

---

**→ 下一步：[第 1 章：打造加一的身体 — Python 快速起步](/ch01/)**
