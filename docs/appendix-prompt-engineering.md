# 📎 附录：AI 辅助学习指南 & Prompt 工程手册

加一每章都在问 AI。同一个问题，问法不同，回答差很多。这里是提问方法和现成模板。

---

## 第 1 部分：Prompt 的五要素

Prompt（提示词）就是递给主厨（LLM）的订单。订单有五栏，填得越全，端出来的菜越对味。

<div data-anim="app-prompt-five-parts"></div>

*只写一句"解释什么是 RAG"，主厨只能猜；五栏填齐，才是一张完整的订单。*

```cards
icon: 🎭
title: 角色 Role
what: AI 以什么身份回答
like: 订单第一栏：找哪种风格的主厨
use: 你是 AI 导师，面向零基础新手
color: blue

icon: 🎯
title: 任务 Task
what: 要它做什么
like: 订单第二栏：做什么菜
use: 用 200 字以内解释 RAG
color: orange

icon: 📦
title: 背景 Context
what: 你的情况和限制
like: 订单第三栏：几位客人、有什么忌口
use: 读者会调 API，没听过 RAG
color: green

icon: 📝
title: 输出 Output
what: 回答要包含什么、多长
like: 订单第四栏：要端出什么
use: 先打比方，再下定义，最后 3 个要点
color: purple

icon: 📐
title: 格式 Format
what: 表格、列表、JSON 还是段落
like: 订单第五栏：怎么装盘
use: Markdown 段落，不用列表
color: red
```

---

## 第 2 部分：六个常用技巧

```cards
icon: 🎭
title: 角色指定
what: 开头写"你是……"
like: 像订单上写明找哪种风格的主厨
use: 你是有 10 年经验的 Python 工程师

icon: 🧪
title: 少样本示例
what: 给几组"输入 → 输出"
like: 像先给主厨看两道样菜
use: 北京几度？→ 天气；2500×12？→ 计算

icon: 🪜
title: 思维链
what: 要求分步写出推理
like: 像让主厨先把做法说一遍再动手
use: 计算 25×4+100÷2，分步展示

icon: 🧾
title: 结构化输出
what: 规定 JSON 结构
like: 像让主厨按统一格式的小票回单
use: 返回 summary、key_points 两个字段

icon: ✂️
title: 任务分解
what: 大任务拆成几问
like: 像一桌大席拆成几道菜分批出
use: 先总结数据 → 写报告 → 写邮件

icon: 🔁
title: ReAct
what: 交替"思考 → 行动 → 观察"
like: 像做菜：做一步、尝一口，再定下一步
use: 想：要查天气 → 调工具 → 看结果
```

> **提示：** 思维链（Chain-of-Thought）就是让主厨先把做法步骤说一遍再动手。ReAct 的完整循环见 [第 4 章](/ch04/)。

---

## 第 3 部分：各章 Prompt 模板

方括号里换成你自己的内容。

**第 1–2 章：学 Python、调 API**

| 用途 | 模板 |
|------|------|
| 学概念 | 你是擅长类比的编程导师。用生活场景解释 [Python 概念]，面向零基础。按"类比 → 代码 → 逐行解释"输出 |
| 审代码 | 你是严格的代码审查员。审查：[代码]。重点看命名、异常处理、可读性，按严重程度排序 |
| 修报错 | 你是 API 调试专家。模型：[模型名]。错误：[报错]。已试过：[方案]。按"原因 → 验证 → 解决 → 预防"输出 |
| 懂参数 | 帮我理解 [temperature] 的作用，给一个能动手验证的小实验 |

**第 3–7 章：RAG、Agent、架构、面试**

| 用途 | 模板 |
|------|------|
| 调检索 | 你是 RAG 架构师。场景：[文档和问题]。配置：[切块大小、嵌入模型、Top-K]。列出可能原因和改法 |
| 设计工具 | 你是 Agent 开发专家。场景：[描述]。列出每个工具的名称、描述、参数，按优先级排序 |
| 评方案 | 你是 AI 架构师。评审我的 [Memory / Multi-Agent] 方案：[描述]。从扩展性、出错处理、成本看，给出风险和建议 |
| 模拟面试 | 你是 AI 应用开发面试官。我的背景：[经历]。先问 3 道基础题，再问 2 道深入题，最后给反馈 |

---

## 第 4 部分：常见错误与改法

| 错误 | 差的问法 | 改后的问法 |
|------|---------|-----------|
| 太模糊 | 写一段代码 | 用 Python 写一个多轮对话函数，要保存对话历史 |
| 不给角色 | 解释什么是 Agent | 你是技术布道师，向非技术人员解释 Agent |
| 不指定格式 | 对比 RAG 和微调 | 用表格对比 RAG 和微调：场景、成本、更新速度 |
| 一次要太多 | 做一个完整的客服 Agent | 分三次问：设计工具 → 查订单工具 → 退货流程 |
| 不给背景 | 代码报错了 | 附上代码、Python 版本、系统和完整报错 |

---

## 第 5 部分：用 AI 辅助学习

```steps
icon: 👀
title: 预习
desc: 让 AI 用 100 字概括今天的概念

icon: 📖
title: 阅读
desc: 读教程，看懂图和动画

icon: ⌨️
title: 实践
desc: 自己敲代码，跑通为止

icon: 🧠
title: 巩固
desc: 让 AI 出题测验，或审查你的代码
```

卡住时，先确认这四样都给了 AI：

```steps
icon: ✅
title: 完整报错信息

icon: ✅
title: 你的代码和期望结果

icon: ✅
title: 已经试过的办法

icon: ✅
title: 正在学哪一章
```

> **建议：** 四样都给了还卡住，就先跳过，回头再看。少做这些事：把 AI 当搜索引擎、不想就问、看不懂就运行 AI 的代码、从不自己敲、收藏了不看。

---

## 第 6 部分：快速参考卡

| 场景 | Prompt 模板 |
|------|------------|
| 概念解释 | 你是导师，用 [类比] 解释 [概念]，面向零基础 |
| 写代码 | 角色：[角色]。用 [语言] 实现 [功能]。限制：[条件] |
| 调试错误 | 你是调试专家。错误：[报错]。代码：[代码]。已试：[方案] |
| 学新概念 | 用 100 字概括 [概念]，再用 3 点说明它解决什么问题 |
| 出练习题 | 你是导师。主题：[主题]。由易到难出 5 题，附答案 |

---

## 写在最后

好 Prompt 是改出来的：

```text
写 → 看结果 → 找问题 → 改 → 再看
```

> **加一说：** "先跑通，再优化。先做成，再做好。"

🏁 你已经完成了整个教程，去做属于你自己的 AI Agent 吧。

**← 上一章：[第 7 章：加一毕业了 — 项目实战清单 & 面试准备](/ch07/)**  
**→ 下一章：[术语表 Glossary](/glossary.md)**

---

## 📚 参考资料

- [Prompt Engineering Guide](https://www.promptingguide.ai/) - comprehensive
- [IBM Prompt Engineering Guide 2026](https://www.ibm.com/think/topics/prompt-engineering-guide)
- [Anthropic's building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Lilian Weng - Prompt Engineering](https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/)
- [AI Engineer Lab Prompt Guide 2026](https://aiengineerlab.in/prompt/guide/)
- [DigitalOcean Prompt Engineering Best Practices](https://digitalocean.com/resources/article/prompt-engineering-best-practices)
- [DecryptPrompt（中文Prompt工程资源）](https://github.com/DSXiangLi/DecryptPrompt)
