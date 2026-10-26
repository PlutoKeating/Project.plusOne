# 👥 第 6 章：加一的团队 — Multi-Agent 何时用

## 故事：一个人忙不过来了

用户让加一"调研竞品，写成报告，再发邮件给全组"。搜索、读文章、写报告、发邮件全挤在一个对话里，上下文越堆越乱。

PlutoKeating 决定给加一组个团队：几个 Agent 分工干活，每个只管一件事。

---

## 团队怎么分工

<div data-anim="ch06-orchestrator-dispatch"></div>

*协调者像行政总厨：拆单、派活、收菜把关；三个档口之间不直接对话。*

```cards
icon: 👥
title: Multi-Agent 多智能体
what: 几个 Agent 分工完成一个大任务
like: 后厨分档口协作：冷菜、热菜、甜点各管一摊
use: 加一的团队：调研、写作、发邮件各一个
color: purple

icon: 🧭
title: Orchestrator 协调者
what: 拆任务、分派、汇总结果
like: 像行政总厨：拆单、派活、最后把关
use: 把"竞品报告"拆成查、写、发三步
color: blue

icon: 🧑‍🔧
title: Worker 工作者
what: 只做一个子任务的单 Agent
like: 像热菜档口的厨师，只管炒菜
use: 调研 Agent 只带搜索工具和调研提示词
color: green

icon: 📒
title: 独立上下文
what: 每个 Agent 各记各的对话
like: 每个档口只看自己那张单
use: 写作 Agent 看不到调研时的搜索过程
color: orange
```

---

## 什么时候需要多 Agent

下面四个问题，有一项答"是"再考虑拆：

```cards
icon: 🎭
title: 要几个不同角色吗？
what: 搜索、写作、审核差别很大
like: 一个档口同时管冷菜、热菜、甜点，手忙脚乱
use: 调研员和写手分开，提示词各自简单

icon: 🎓
title: 要不同专业知识吗？
what: 每块需要的背景知识不同
like: 甜点交给甜点档口，冷菜交给冷菜档口
use: 法律条款交给懂合同的 Agent 审

icon: ⚡
title: 能同时开工吗？
what: 子任务之间互不依赖
like: 几个档口同时做不同的菜
use: 同时查天气、新闻、股票

icon: 🧺
title: 上下文常被塞满吗？
what: 一个对话装不下所有中间资料
like: 出餐台的订单夹夹满了，新单挤掉旧单
use: 调研资料太长，挤掉了写作要求
```

> **建议：** 简单问答、只调一个工具（比如查天气），单 Agent 就够了。

---

## 三种协作模式

<div data-anim="ch06-serial-vs-parallel"></div>

*串行像一道菜按工序往下传；并行像几个档口同时做不同的菜。*

```cards
icon: 🧭
title: Orchestrator-Worker
what: 协调者拆任务，各 Worker 做一块再汇总
like: 行政总厨拆单，冷菜、热菜、甜点档口各做一份
use: 竞品报告：查、写、发分给三个 Agent
color: blue

icon: 🏭
title: Pipeline 流水线
what: A 的输出交给 B，B 的输出交给 C
like: 一道菜按工序往下传：切配 → 炒 → 装盘
use: 先调研，再写报告，最后质检
color: green

icon: ⚖️
title: Debate 辩论
what: 两个 Agent 各给答案，评判选一个
like: 两个档口各做一版，试菜员尝过挑一版
use: 两份代码审查意见，由评判 Agent 定
color: orange
```

"调研 → 写作 → 质检"三个 Agent 的协调逻辑：

```text
函数 协调者(主题, 要求):
    资料 = 调研Agent(主题)
    报告 = 写作Agent(资料, 要求)
    评审 = 质检Agent(报告)
    如果 评审分数 太低:
        报告 = 写作Agent(资料, 要求 + 评审意见)
    返回 报告
```

---

## 四个陷阱

```cards
icon: 🏗️
title: 过度设计
what: 小事也拆很多 Agent；能不拆就不拆
like: 顾客只要一杯水，却叫齐三个档口
use: 问"几点了"也启动 5 个 Agent
color: red

icon: 🌀
title: 互相干扰
what: 共用上下文会串味；各用各的
like: 几个档口共用一张单，互相涂改
use: 调研的草稿搅乱了写作的思路
color: orange

icon: 🧨
title: 错误传播
what: 一步错步步错；每步都检查
like: 切配切错了料，炒和装盘跟着错
use: 资料查错，报告跟着写错
color: purple

icon: 💸
title: 成本上涨
what: 多一个 Agent 多几次调用；先估算
like: 多开一个档口，老板就多付一份工钱
use: 三个 Agent 的 Token 是单 Agent 好几倍
color: blue
```

---

## 新手的顺序

Anthropic 的 Agent 构建指南提到：很多成功的系统只用简单的单 Agent，等实际失败证明有必要，再加复杂度。

```steps
icon: ✅
title: 单 Agent + 简单工具

icon: ✅
title: 单 Agent + 复杂工具 + 好的 Memory

icon: ✅
title: 单 Agent 稳定运行

icon: 🔍
title: 找到瓶颈，判断是否要拆
desc: 拆分是不是解决瓶颈最简单的办法

icon: 🧭
title: 从 Orchestrator-Worker 开始试
```

---

## 🤖 向 AI 提问

> **判断是否需要：** "我的场景是 [描述场景]。该用多 Agent 还是单 Agent？说明理由。"

> **设计架构：** "请为 [场景] 设计一个多 Agent 系统：需要哪些 Agent，各自负责什么，数据怎么传递，画出架构图。"

---

## 检查清单

- [ ] 能判断一个场景该用单 Agent 还是多 Agent
- [ ] 能说出三种协作模式的数据流向
- [ ] 能画出一个三 Agent 系统的模块图
- [ ] 知道四个常见陷阱和对策

> **加一说：** "从只会复读到能带团队，我长大了很多。下一步该用实际项目检验一下了。"

---

## 📚 参考资料

- https://www.anthropic.com/engineering/building-effective-agents — Anthropic 的 Agent 构建指南，重点阐述何时不应使用多 Agent 架构
- https://docs.crewai.com/ — CrewAI，专为多 Agent 协作设计的框架
- https://microsoft.github.io/autogen/ — 微软 AutoGen，多 Agent 对话框架
- https://langchain-ai.github.io/langgraph/tutorials/multi_agent/ — LangGraph 多 Agent 教程
- https://arxiv.org/abs/2308.08155 — AutoGen 论文：Enabling Next-Gen LLM Applications via Multi-Agent Conversation

---

**← 上一章：[第 5 章：加一的工具箱与记忆库 — Tool, MCP, Memory](/ch05/)**  
**→ 下一章：[第 7 章：加一毕业了 — 项目实战清单 & 面试准备](/ch07/)**
