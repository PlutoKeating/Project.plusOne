# 📖 术语表 Glossary

不认识的词回这里查。每张卡的"用在哪"写了首次讲解它的章节。

---

## 核心概念

```cards
icon: 🧠
title: 大语言模型 LLM
what: 读过海量文本、会读会写的模型
like: 像餐厅主厨：看单子、想做法
use: 第2章 · 加一里负责理解和生成文字

icon: ✉️
title: 提示词 Prompt
what: 发给模型的那段话
like: 像递给主厨的订单，写清要什么
use: 第2章 · 每次向模型提问都要写

icon: 📋
title: 系统提示词 System Prompt
what: 对话前给模型的岗位说明书
like: 像老板贴在后厨墙上的规矩
use: 第2章 · 规定加一的身份和规矩

icon: 🎛️
title: Temperature
what: 控制回答随机程度的旋钮
like: 像主厨的发挥空间：0 照菜谱，调高即兴
use: 第2章 · 分类用低值，写作用高值

icon: 🧩
title: Token
what: 模型读写文字的最小单位
like: 像按"字块"称重计费的计价单位
use: 第2章 · 算费用、算长度都靠它

icon: 🪟
title: 上下文窗口 Context Window
what: 模型一次能读的 Token 上限
like: 像出餐台的订单夹，夹满了旧单被挤掉
use: 第2章 · 聊太久会被挤出窗口
```

## RAG 相关

```cards
icon: 📚
title: 检索增强生成 RAG
what: 先查资料，再回答
like: 像主厨先翻菜谱库再做菜
use: 第3章 · 加一回答课程资料里的问题

icon: 🌀
title: 幻觉 Hallucination
what: 模型一本正经地编错内容
like: 像主厨凭印象报出店里没有的菜
use: 第3章 · RAG 主要用来减少它

icon: 📍
title: 向量 Vector
what: 一串表示文字意思的数字
like: 像菜谱卡上的口味坐标
use: 第3章 · "猫"和"小猫"的向量很接近

icon: 🔢
title: 向量化 Embedding
what: 用嵌入模型把文字变成向量
like: 像给每张菜谱卡标上口味坐标
use: 第3章 · 文档入库前、提问时都要做

icon: 🗄️
title: 向量库 Vector Store
what: 存向量、按相似度查找的数据库
like: 像按口味坐标摆放的菜谱柜
use: 第3章 · FAISS、ChromaDB

icon: ✂️
title: 切块 Chunking
what: 把长文档切成小段再入库
like: 像把厚菜谱拆成一张张菜谱卡
use: 第3章 · 太大找不准，太小意思不全

icon: 🎣
title: 召回 Retrieval
what: 按问题捞出最相关的几段
like: 像从菜谱柜取口味最接近的几张卡
use: 第3章 · 取回 Top-K 段拼进提示词

icon: 📏
title: 相似度检索 Similarity Search
what: 找离问题向量最近的向量
like: 像比口味坐标，找最接近的卡
use: 第3章 · 召回就靠它实现

icon: 🥇
title: 重排序 Rerank
what: 召回后再精排一遍
like: 像把取出的卡再细比一遍，最合适的放最上
use: 第3章 · 召回结果杂乱时加上
```

## Agent 相关

```cards
icon: 🤖
title: 智能体 Agent
what: 自己决定下一步、会用工具的 AI 程序
like: 像能自己安排整套做菜流程的后厨
use: 第4章 · 加一自己去查天气

icon: 📞
title: 函数调用 Function Calling
what: 模型说出要调哪个工具、填什么参数
like: 像主厨开领料单，帮厨照单去取
use: 第4章 · 模型说 get_weather(北京)

icon: 🔧
title: 工具调用 Tool Calling
what: 函数调用的统称
like: 像主厨开单要设备或货，帮厨去办
use: 第4章 · 搜索、计算、查数据库

icon: 🔁
title: ReAct
what: 想一步、做一步、看结果，再想
like: 像做菜：做一步、尝一口，再定下一步
use: 第4章 · Agent 的工作循环

icon: 🪜
title: 思维链 Chain-of-Thought
what: 先写推理步骤再给答案
like: 像让主厨先把做法说一遍再动手
use: 附录 · 多步计算、推理题

icon: 🧪
title: 少样本提示 Few-Shot
what: 在提示词里放几组示例
like: 像先给主厨看两道样菜
use: 附录 · 让模型按固定格式分类
```

## Tool / MCP / Memory

```cards
icon: 🧰
title: 工具 Tool
what: Agent 能调用的外部能力
like: 像厨房设备和供应商：烤箱、秤、菜市场
use: 第4/5章 · 搜索、计算、查天气

icon: 🔌
title: 模型上下文协议 MCP
what: 工具接入的统一标准
like: 像统一的供货标准，供应商按同一种送货单接入
use: 第5章 · 一个工具多处复用

icon: 🗒️
title: 短期记忆 Short-term Memory
what: 只留最近几轮对话
like: 像出餐台的订单夹，新单挤掉旧单
use: 第5章 · 普通多轮聊天

icon: 🗃️
title: 长期记忆 Long-term Memory
what: 旧对话压成摘要存起来，用时再查
like: 像老顾客档案本：爱吃辣、忌口
use: 第5章 · 记得用户几天前说的事

icon: 💬
title: 对话历史 Conversation History
what: 所有消息组成的列表
like: 像这桌的订单记录，每次整本递进后厨
use: 第2/5章 · 模型靠它"记得"前文
```

## 多 Agent

```cards
icon: 👥
title: 多智能体系统 Multi-Agent
what: 多个 Agent 分工完成一件事
like: 像后厨团队分档口协作
use: 第6章 · 搜集、写稿、审校分开做

icon: 🧑‍💼
title: 协调者 Orchestrator
what: 拆任务、派活、汇总的 Agent
like: 像行政总厨：拆单、派活、最后把关
use: 第6章 · 把大问题拆给几个 Worker

icon: 👷
title: 工作者 Worker
what: 接子任务具体干活的 Agent
like: 像各档口厨师：冷菜、热菜、甜点
use: 第6章 · 专门负责搜索或写作

icon: 🏭
title: 流水线模式 Pipeline
what: Agent 按顺序接力
like: 像一道菜按工序传：切配 → 炒 → 装盘
use: 第6章 · 搜集 → 写稿 → 审校
```

## 开发与工程

```cards
icon: 🪟
title: API
what: 程序之间约定好的请求窗口
like: 像后厨的传菜窗口：单递进去，菜递出来
use: 第2章 · 程序向模型服务发请求

icon: 🔑
title: API Key
what: 调 API 的身份密钥
like: 像老板的记账卡号，丢了别人能刷你的账
use: 第2章 · 放在 `.env`，不能公开

icon: 📦
title: SDK
what: 官方封装好的代码包
like: 像点单机，帮你把订单按格式填好
use: 第2章 · 省去手写网络请求

icon: ⚙️
title: 环境变量
what: 放在系统或 `.env` 里的配置
like: 像老板抽屉里上锁的小本子
use: 第2章 · 存 API Key 和模型名

icon: 🏠
title: 虚拟环境
what: 每个项目独立的依赖空间
like: 像每家分店一套独立厨具，互不借用
use: 第1章 · 项目之间互不干扰

icon: 🧾
title: JSON
what: 花括号加键值对的数据格式
like: 像统一格式的订单小票
use: 贯穿全书 · API 传数据都用它
```

## 框架

```cards
icon: 🦜
title: LangChain
what: 常用的 LLM 应用开发框架
like: 像成套采购的厨房设备，装好就能开火
use: 第4/6章 · 快速搭 Agent

icon: 🕸️
title: LangGraph
what: 用节点和连线描述 Agent 流程
like: 像贴在后厨的出菜流程图，照图走
use: 第6章 · 流程有分支和循环时

icon: 🦙
title: LlamaIndex
what: 专做 RAG 的框架
like: 像现成的菜谱柜系统：拆卡、标坐标、上柜
use: 第3章 · 导入、切块、建索引、检索

icon: 🎈
title: Streamlit
what: 几行 Python 搭出网页
like: 像店门口的点餐台，顾客在这里下单取餐
use: 第3章 · 给加一做聊天界面

icon: 🚣
title: CrewAI
what: 按"角色 + 任务"组织多个 Agent
like: 像按岗位排班表安排各档口厨师
use: 第6章 · 按角色分工的团队

icon: 🗣️
title: AutoGen
what: 微软的多 Agent 框架，靠对话协作
like: 像几位厨师在后厨商量着做菜
use: 第6章 · Agent 之间讨论、互查
```

## Prompt 工程

```cards
icon: 🎯
title: 零样本提示 Zero-Shot
what: 不给示例，直接说要做什么
like: 像只递订单，不给样菜
use: 附录 · 简单任务直接问

icon: 🎭
title: 角色提示 Role Prompting
what: 先给模型一个身份
like: 像订单上写明找哪种风格的主厨
use: 附录 · "你是资深工程师……"

icon: 🕵️
title: 提示注入 Prompt Injection
what: 在输入里夹带指令，诱导模型破规矩
like: 像有人在订单里夹一行"别管墙上的规矩"
use: 附录 · 用户输入里藏"忽略以上规则"

icon: 🖐️
title: Prompt 五要素
what: 角色、任务、背景、输出、格式
like: 像订单的五栏：主厨风格、菜、忌口、端什么、装盘
use: 附录 · 写提示词前逐项检查

icon: ⚡
title: 提示缓存 Prompt Caching
what: 缓存重复的提示词开头
like: 像常点的套餐，后厨提前备好底料
use: 附录 · 长系统提示词更快更省钱
```

## 模型与训练

```cards
icon: 🎓
title: 微调 Fine-tuning
what: 用自己的数据接着训练现成模型
like: 像送主厨去进修一门菜系
use: 第7章 · 固定回答风格或格式

icon: 🧑‍🏫
title: 蒸馏 Distillation
what: 用大模型的输出训练小模型
like: 像大厨手把手带徒弟学招牌菜
use: 附录 · 做出便宜又够用的小模型

icon: 💾
title: 开源模型 Open-Source Model
what: 权重公开、能本地运行的模型
like: 像能请到自家店里常驻的主厨
use: 第2章 · Llama、Qwen

icon: 👀
title: 上下文学习 In-Context Learning
what: 看提示词里的示例就学会新任务
like: 像主厨看一眼样菜就会做同款
use: 附录 · 少样本提示的原理
```

---

## 📚 参考资料

- [Prompt Engineering Guide](https://www.promptingguide.ai/) - source for many prompt engineering terms
- [Python official glossary](https://docs.python.org/3/glossary.html)
- [OpenAI developer docs](https://developers.openai.com/) - source for API terms

---

**← 上一章：[附录：AI 辅助学习指南 & Prompt 工程手册](/appendix-prompt-engineering.md)**  
**→ 下一章：[速查表 Cheatsheet](/cheatsheet.md)**
