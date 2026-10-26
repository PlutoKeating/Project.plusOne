# 🖐️ 第 4 章：加一学会动手 — Agent 核心循环

## 故事：从"说话"到"做事"

用户让加一查天气、发邮件，它只会回"抱歉，我只会说话"。PlutoKeating 给它装上"双手"。能动手做事的 AI，叫 **Agent（智能体）**。

---

## Agent 由哪几块组成

```text
Agent = Chatbot + Tools + Loop
```

```cards
icon: 🧠
title: Chatbot
what: 会聊天的大语言模型（LLM）
like: 只会口头报菜名、不能下厨的主厨
use: 判断"查天气"要不要用工具
color: blue

icon: 🔧
title: Tools 工具
what: 程序能调用的外部功能
like: 厨房设备和供应商：烤箱、秤、菜市场
use: `get_weather` 查北京天气
color: orange

icon: 🔁
title: Loop 循环
what: 想一步、做一步、看结果，再想
like: 主厨开单、帮厨取料，反复到出菜
use: 查不到就换个关键词再搜
color: green
```

---

## 循环怎么转

<div data-anim="ch04-react-loop"></div>

```cards
icon: 🔄
title: ReAct
what: 推理（Reasoning）和行动（Acting）交替
like: 做一步、尝一口，再定下一步
use: 先查天气，再决定要不要提醒带伞
color: blue

icon: 📜
title: 对话记录
what: 程序保存的一串消息
like: 这道菜的操作记录本，每步都记上
use: 问题、LLM 的决定、工具结果都在里面
color: purple
```

---

## Function Calling：四步来回

<div data-anim="ch04-function-calling"></div>

```cards
icon: 📞
title: Function Calling
what: 让 LLM 能"点名"工具的机制
like: 主厨开领料单，帮厨照单去取
use: LLM 写出 `get_weather(北京)`
color: orange

icon: 📋
title: 工具清单
what: 每个工具的名字、用途、参数
like: 墙上的设备说明牌，主厨照着挑
use: 第 ① 步随问题一起发给 LLM
color: blue
```

> **注意：** LLM 不运行代码。第 ④ 步后它若又要工具，就回到第 ② 步。

---

## 循环伪代码

```python
对话记录 = [用户问题]
for 第几步 in range(最多步数):
    回复 = LLM(对话记录, 工具清单)
    if 回复 是 最终回答: return 回复
    for 调用 in 回复.工具调用:
        结果 = 执行工具(调用)        # 出错时，错误信息就是结果
        对话记录.追加(调用, 结果)
return "步数用完，请简化问题后重试"
```

<div data-anim="ch04-max-steps"></div>

```cards
icon: ⛔
title: 最多步数
what: 循环最多绕几圈
like: 一道菜最多返工 N 次，超了向顾客说明
use: 搜索一直超时，绕 5 圈就停
color: red

icon: 🩹
title: 错误当结果
what: 工具报错时，把错误交回 LLM
like: 仓库没货也回话"没货"，主厨换食材
use: LLM 看到"超时"，改用别的工具
color: green
```

---

## 设计 Agent 的四条原则

```cards
icon: 🔩
title: 工具要小
what: 一个工具只做一件事
like: 一台设备一件事：烤箱烤、秤称重
use: `search_web`、`send_email` 分开
color: blue

icon: 🏷️
title: 描述要清楚
what: LLM 靠描述挑工具
like: 设备说明牌写清能干什么、放什么
use: "查新闻和实时数据"比"搜索"好挑
color: purple

icon: 🔢
title: 限制步数
what: 给循环设上限
like: 最多返工 N 次，超了向顾客说明
use: 加一最多绕 5 圈
color: orange

icon: 🧯
title: 接住失败
what: 超时、报错都要处理
like: 仓库没货也要回话，后厨不停摆
use: 错误当结果交回 LLM
color: red
```

> **建议：** Anthropic 发现，好用的 Agent 往往结构最简单。先用单次 LLM 调用，需要时再加工具。

---

## 🤖 向 AI 提问

> "我想给 Agent 加一个搜索网页的工具，请帮我设计接口和参数。"

> "LLM 直接回答了，没有调用工具。这是我的工具定义：[贴代码]。可能是什么原因？"

---

## 检查清单

- [ ] 用自己的话解释 Agent = Chatbot + Tools + Loop
- [ ] 画出 ReAct 循环：思考 → 调用工具 → 看结果 → 再思考
- [ ] 说清 Function Calling 四步里，哪步 LLM 做、哪步程序做
- [ ] 说出设计工具的四条原则

---

## 📚 参考资料

- [Lilian Weng's Agent Blog](https://lilianweng.github.io/posts/2023-06-23-agent/) — Agent 领域的经典参考，梳理了规划、记忆、工具使用等核心概念
- [ReAct Prompting](https://www.promptingguide.ai/techniques/react) — ReAct（推理 + 行动）模式指南
- [Anthropic: Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) — Anthropic 团队构建 Agent 的实践经验
- [OpenAI Function Calling Docs](https://platform.openai.com/docs/guides/function-calling) — OpenAI 官方 Function Calling 文档
- [LangChain Agent Concepts](https://python.langchain.com/docs/concepts/agents/) — LangChain 框架中的 Agent 概念与用法

> **加一说：** "我会做事了。可工具越来越多，接法各不相同；而且聊完就忘。我需要一套工具箱规范和一个记忆系统。"

---

**← 上一章：[第 3 章：加一学会读书 — RAG 从零到 Demo](/ch03/)**  
**→ 下一章：[第 5 章：加一的工具箱与记忆库 — Tool, MCP, Memory](/ch05/)**
