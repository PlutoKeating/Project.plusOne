# 🚀 第 7 章：加一毕业了 — 项目实战清单 & 面试准备

## 故事：找工作

加一会理解语言、查资料、用工具、记对话，还能带团队。她问 PlutoKeating 面试会问什么。

"会问你做过什么项目，踩过什么坑，怎么解决的。"

---

## 三个必做项目

```cards
icon: 📚
title: 项目 1 知识库问答 ⭐⭐
what: 照着上传的文档回答问题
like: 主厨先翻菜谱库再做菜，不凭记忆瞎做
use: 练第 3 章的 RAG
color: blue

icon: 🧰
title: 项目 2 多工具助手 ⭐⭐⭐
what: 会搜索、计算、查天气、记待办
like: 能自己安排整套做菜流程的后厨
use: 练第 4、5 章的工具调用和记忆
color: green

icon: 🏢
title: 项目 3 业务综合助手 ⭐⭐⭐⭐
what: 把 RAG、工具、记忆组合起来
like: 菜谱库、厨房设备、老顾客档案一应俱全的整家店
use: 练全部章节，解决一个真实需求
color: purple
```

### 项目 1：知识库问答助手（RAG）

上传文档，系统照着文档回答，并标出引用的原文。

<div data-anim="ch07-kb-qa-flow"></div>

*上半部分像开业前把菜谱拆卡、上柜，只做一次；下半部分每来一单都走一遍。*

```cards
icon: 📄
title: 文档解析
what: 把 PDF、TXT 转成纯文本
like: 把手写菜谱誊成统一格式的打印稿
use: 读入公司的员工手册

icon: ✂️
title: 切块器
what: 长文本切成几百字的小段
like: 把厚菜谱拆成一张张菜谱卡
use: 手册切成 300 段

icon: 🔢
title: Embedding + 向量库
what: 每段转成向量，按意思查找
like: 给菜谱卡标口味坐标，放进按坐标摆的菜谱柜
use: FAISS / ChromaDB 存段落向量

icon: 🧠
title: 生成模块
what: 段落和问题一起交给 LLM
like: 把选出的菜谱卡和订单夹在一起递给主厨
use: 照着第 3 章原文回答"年假几天"

icon: 🖥️
title: 前端
what: 上传、提问、显示答案和出处
like: 餐厅前厅：顾客点单、取菜的地方
use: 用 Streamlit / Gradio 几十行搭好
```

> **建议：** 加分项——支持 Word、Markdown；中文换更合适的 Embedding 模型；标出答案来自哪一段。

### 项目 2：多工具智能助手（Tool Calling）

```text
用户消息 → 记忆模块补上历史 → LLM 决定是否调工具
   ├─ 需要工具 → 注册表找到函数 → 执行 → 结果交回 LLM → 再判断
   └─ 不需要   → 直接回答 → 写入记忆
```

```cards
icon: 🗂️
title: 工具注册表
what: 记下每个工具的名称、描述、参数
like: 墙上的设备说明牌：叫什么、能干什么
use: 登记 搜索、计算器、查天气

icon: 🔁
title: Agent 循环
what: LLM 决定 → 执行 → 交回，直到能答
like: 做一步、尝一口、再决定下一步
use: 先查天气，再算温差，再回答

icon: 🧠
title: 记忆模块
what: 短期记最近几轮，长期存摘要
like: 订单夹放眼前几单，老顾客档案本记长期的
use: 记住用户上次说"我在北京"

icon: 🧯
title: 错误处理
what: 失败就重试，超过步数就停
like: 仓库没货也回话，主厨换食材；最多返工 N 次
use: 天气接口超时，换个说法告诉用户
```

> **建议：** 加分项——用 MCP 接入工具；界面上展示每一步调用；允许用户加自己的 API。

### 项目 3：业务场景综合助手

三个方向任选一个，挑你自己关心的领域，调试到深夜也更容易坚持。

```cards
icon: 📊
title: A. 运营提效
what: 查数据、出报表、发邮件
like: 每晚打烊自动汇总当天流水，交给老板
use: 查询工具 + 报表模板 + 邮件工具 + 定时任务

icon: 📈
title: B. 数据分析
what: 上传 CSV，用大白话提问
like: 顾客问哪道菜卖得最好，后厨翻账本算给他看
use: 表结构预览 + 问题转 SQL + 画图 + 写结论

icon: 🗃️
title: C. 个人知识管理
what: 收集零散信息建知识库
like: 随手收来的食谱自动归进菜谱库
use: 网页摘要 + 标签归档 + 问答 + 定期回顾
```

---

## 项目目录结构

目录和上面的模块一一对应：

```
my-ai-project/
├── .env               # API Key（不提交）
├── .env.example       # 环境变量模板（提交）
├── .gitignore
├── requirements.txt   # 依赖列表
├── README.md          # 介绍、运行方式、架构
├── src/
│   ├── llm.py         # LLM 调用：重试、Token 统计
│   ├── tools.py       # 工具注册表
│   ├── memory.py      # 短期 / 长期记忆
│   ├── agent.py       # Agent 循环
│   └── rag.py         # 切块、Embedding、检索
├── data/              # 文档数据，和代码分开
├── tests/
└── ui/app.py          # Streamlit / Gradio 前端
```

> **注意：** `.env` 必须写进 `.gitignore`。API Key 泄露到公开仓库，别人很快就能用它刷出大额账单。

---

## 面试高频问题 TOP 20

### 基础概念类

```cards
icon: 📚
title: Q1 什么是 RAG？
what: 先查资料再回答，减少幻觉

icon: ⚖️
title: Q2 RAG 和微调的区别？
what: RAG 查外部资料；微调改模型参数

icon: 🤖
title: Q3 Agent 和 Chatbot 的区别？
what: Agent = Chatbot + 工具 + 循环

icon: 🔧
title: Q4 Function Calling 原理？
what: LLM 给出工具名和参数，程序去执行

icon: 🔌
title: Q5 MCP 解决什么？
what: 工具接入的统一标准，一次接入到处用

icon: 🔢
title: Q6 什么是 Embedding？
what: 文字转向量，意思越近距离越近

icon: 🔁
title: Q7 什么是 ReAct？
what: 思考 → 行动 → 观察，循环往复

icon: 🌫️
title: Q8 幻觉怎么缓解？
what: RAG 给依据、限定范围、调低 Temperature
```

### 实践类

```cards
icon: 🗣️
title: Q9 介绍一个 Agent 项目
what: 场景 → 架构 → 选型 → 难点 → 解法

icon: 🚑
title: Q10 Agent 出异常怎么办？
what: 重试、捕获工具错误、限步数、降级

icon: 🔧
title: Q11 工具接口怎么设计？
what: 职责单一、描述清楚、参数带类型

icon: 🌀
title: Q12 陷入死循环怎么办？
what: 设最大步数，检测重复输出

icon: 🧺
title: Q13 上下文满了怎么办？
what: 留最近 N 轮、摘要压缩、按相关性保留

icon: 🔍
title: Q14 RAG 效果差怎么查？
what: 看切块、Embedding 模型、要不要改写问题
```

### 设计类

```cards
icon: 🎧
title: Q15 设计一个客服 Agent
what: 需求 → 架构 → 工具 → 知识库 → 记忆

icon: 📏
title: Q16 怎么评估 Agent？
what: 完成率、工具准确率、延迟、Token、满意度

icon: 👥
title: Q17 多 Agent 还是单 Agent？
what: 要多角色、要并行、上下文不够；占 2 项再拆

icon: 🛡️
title: Q18 怎么保证安全？
what: 防注入、限工具权限、高风险操作人工确认

icon: 🧩
title: Q19 选哪个框架？
what: LangChain 生态全，CrewAI 适合多 Agent

icon: 🔭
title: Q20 未来 1–2 年方向？
what: MCP 等标准化、多模态、垂直领域、端侧
```

---

## 简历怎么写

```
AI 应用开发
├── 大模型调用: LLM API, Function Calling, Prompt Engineering
├── RAG: Embedding, 向量库(FAISS/ChromaDB), 检索增强生成
├── Agent: ReAct, 工具设计, Memory, Multi-Agent
└── 工具: Python, Streamlit, Git, Docker, LangChain
```

> **建议：** 项目描述写成"做了什么 + 用了什么 + 数字结果"，例如：基于 RAG 开发知识库问答系统，支持多格式文档上传和语义检索，回答采纳率 XX%。

讲项目时按 STAR 法则的顺序：

```steps
icon: 🅢
title: Situation 背景
desc: 运营每天花 3 小时手动查数据

icon: 🅣
title: Task 任务
desc: 做一个 AI 助手自动回答数据查询

icon: 🅐
title: Action 行动
desc: 设计 RAG 流程，连数据库，搭前端

icon: 🅡
title: Result 结果
desc: 查询从 3 小时降到 10 分钟
```

---

## 🤖 向 AI 提问

> **模拟面试：** "请模拟一场 AI 应用开发工程师面试。你当面试官，问我 Agent 和 RAG 的问题，每次回答后给反馈。"

> **优化简历：** "这是我简历里的项目描述：[贴文字]。请用 STAR 法则改写，让它在技术面试中更有说服力。"

---

## 最后的建议

```steps
icon: ▶️
title: 跑通过才算会
desc: 代码能跑起来，才说明你理解了

icon: 🛠️
title: 做过才算懂
desc: 完整做完一个项目，才知道坑在哪

icon: 🗣️
title: 能讲清才算掌握
desc: 能用大白话讲给别人听
```

> **加一说：**
>
> "从一个小婴儿到能带团队做项目，最感谢的是你，是你一行一行代码把我搭起来的。现在，轮到你去创造你自己的'加一'了。"
>
> **🚀 去写出你的第一个 Agent 吧。**

---

## 📚 参考资料

- https://github.com/ — GitHub，搜索 "RAG" 和 "AI agent" 开源项目获取灵感
- https://streamlit.io/gallery — Streamlit 官方作品集，寻找 UI 设计灵感
- https://gradio.app/ — Gradio，适合 AI Demo 的 Streamlit 替代方案
- https://www.linkedin.com/ — LinkedIn，搜索 AI 工程师职位描述，了解雇主真实需求
- https://github.com/DSXiangLi/DecryptPrompt — 中文 AI Prompt 工程资源合集
- https://github.com/datawhalechina — DataWhale，中文 AI 学习社区

---

**← 上一章：[第 6 章：加一的团队 — Multi-Agent 何时用](/ch06/)**  
**→ 下一章：[附录：AI 辅助学习指南 & Prompt 工程手册](/appendix-prompt-engineering.md)**
