# 📖 术语表 Glossary

遇到不认识的词，回这里查。按主题分组，"出现在"一栏指向首次讲解它的章节。

---

## 核心概念

| 术语 | 英文 | 白话解释 | 出现在 |
|------|------|---------|--------|
| 大语言模型 | LLM (Large Language Model) | 用海量文本训练出来的模型，会读也会写人类语言。加一的"大脑"就是它。 | 第2章 |
| 提示词 | Prompt | 你发给模型的那段文字。模型根据它决定回什么。 | 第2章 |
| 系统提示词 | System Prompt | 对话开始前给模型的"岗位说明书"，规定它扮演谁、守什么规矩。 | 第2章 |
| Temperature | — | 控制回答随机程度的旋钮。调低回答更稳定，调高更发散。 | 第2章 |
| Token | — | 模型读写文字的最小单位，一个词或半个字都可能是一个 Token。计费和长度限制都按它算。 | 第2章 |
| 上下文窗口 | Context Window | 模型一次能读进去的文字上限，按 Token 计。超出的部分模型看不到。 | 第2章 |

## RAG 相关

| 术语 | 英文 | 白话解释 | 出现在 |
|------|------|---------|--------|
| 检索增强生成 | RAG (Retrieval-Augmented Generation) | 先从资料库里找相关内容，再让模型照着资料回答。相当于开卷考试。 | 第3章 |
| 幻觉 | Hallucination | 模型一本正经地编出错误内容。RAG 主要就是用来减少它。 | 第3章 |
| 向量 | Vector / Embedding | 用一串数字表示一段文字的意思。意思相近的文字，数字也相近。 | 第3章 |
| 向量化 | Embedding | 把文字变成向量的过程，由专门的嵌入模型完成。 | 第3章 |
| 向量库 | Vector Store | 专门存向量、按相似度查找向量的数据库，例如 FAISS、ChromaDB。 | 第3章 |
| 切块 | Chunking | 把长文档切成小段再存入向量库。段太大找不准，段太小意思不完整。 | 第3章 |
| 召回 | Retrieval | 根据用户问题，从资料库里捞出最相关的几段。 | 第3章 |
| 相似度检索 | Similarity Search | 在向量库里找和问题向量距离最近的那些向量。召回就是靠它实现的。 | 第3章 |
| 重排序 | Rerank | 召回之后，用更精细的模型把结果重新排一遍，把最相关的放前面。 | 第3章 |

## Agent 相关

| 术语 | 英文 | 白话解释 | 出现在 |
|------|------|---------|--------|
| 智能体 | Agent | 能自己判断下一步、调用工具、根据结果继续行动的 AI 程序。 | 第4章 |
| 函数调用 | Function Calling | 模型不直接回答，改为输出"要调哪个工具、填什么参数"，由程序去执行。 | 第4章 |
| 工具调用 | Tool Calling | 函数调用的统称，工具可以是函数、接口或外部服务。 | 第4章 |
| ReAct | Reasoning + Acting | Agent 的工作循环：想一步、做一步、看结果，再想下一步。 | 第4章 |
| 思维链 | Chain-of-Thought (CoT) | 让模型先写出推理步骤再给答案，复杂问题更容易答对。 | 附录 |
| 少样本提示 | Few-Shot Prompting | 在提示词里放几个"输入→输出"示例，让模型照着格式做。 | 附录 |

## Tool / MCP / Memory

| 术语 | 英文 | 白话解释 | 出现在 |
|------|------|---------|--------|
| 工具 | Tool | Agent 能调用的外部能力，例如搜索、计算、查天气。 | 第4/5章 |
| 模型上下文协议 | MCP (Model Context Protocol) | 一套统一的工具接入标准。工具按它的格式提供，任何支持 MCP 的应用都能直接接上，类似 USB-C 接口。 | 第5章 |
| 短期记忆 | Short-term Memory | 只保留最近几轮对话，旧的自动丢掉，像一个滑动窗口。 | 第5章 |
| 长期记忆 | Long-term Memory | 把历史对话压缩成摘要存起来，需要时再检索出来用。 | 第5章 |
| 对话历史 | Conversation History | 多轮对话里所有消息组成的列表。每次调用模型都要把它一起发过去，模型才"记得"前文。 | 第2/5章 |

## 多 Agent

| 术语 | 英文 | 白话解释 | 出现在 |
|------|------|---------|--------|
| 多智能体系统 | Multi-Agent System | 多个 Agent 分工合作完成一件事。 | 第6章 |
| 协调者 | Orchestrator | 负责拆任务、派活、汇总结果的那个 Agent，相当于项目经理。 | 第6章 |
| 工作者 | Worker | 接到子任务后具体执行的 Agent。 | 第6章 |
| 流水线模式 | Pipeline Pattern | 几个 Agent 按固定顺序接力，上一个的输出是下一个的输入。 | 第6章 |

## 开发与工程

| 术语 | 英文 | 白话解释 | 出现在 |
|------|------|---------|--------|
| API | Application Programming Interface | 程序之间约定好的"点单窗口"。你按格式发请求，对方按格式回结果。 | 第2章 |
| API Key | — | 调用 API 时证明身份的密钥，相当于密码，不能公开。 | 第2章 |
| SDK | Software Development Kit | 官方封装好的代码包，帮你省去手写网络请求的麻烦。 | 第2章 |
| 环境变量 | Environment Variable | 存在系统或 `.env` 文件里的配置，常用来放 API Key，避免写进代码。 | 第2章 |
| 虚拟环境 | Virtual Environment | 给每个 Python 项目单独准备的依赖空间，项目之间互不干扰。 | 第1章 |
| JSON | JavaScript Object Notation | 一种用花括号和键值对表示数据的文本格式，API 之间传数据基本都用它。 | 贯穿全书 |

## 框架

| 术语 | 英文 | 白话解释 | 出现在 |
|------|------|---------|--------|
| LangChain | — | 常用的 LLM 应用开发框架，把模型调用、工具、记忆等封装成可组合的模块。 | 第4/6章 |
| LangGraph | — | LangChain 团队出的 Agent 编排框架，用"节点 + 连线"的图来描述流程。 | 第6章 |
| LlamaIndex | — | 专注 RAG 的框架，负责文档导入、切块、建索引和检索。 | 第3章 |
| Streamlit | — | 用几行 Python 就能搭出网页界面的框架，适合做 AI 应用演示。 | 第3章 |
| CrewAI | — | 多 Agent 协作框架，按"角色 + 任务"组织多个 Agent。 | 第6章 |
| AutoGen | — | 微软出的多 Agent 框架，让多个 Agent 通过对话协作。 | 第6章 |

## Prompt 工程

| 术语 | 英文 | 白话解释 | 出现在 |
|------|------|---------|--------|
| 零样本提示 | Zero-Shot Prompting | 不给示例，直接告诉模型要做什么。 | 附录 |
| 角色提示 | Role Prompting | 先给模型设定一个身份，例如"你是资深工程师"，让回答更贴合该身份的水平和口吻。 | 附录 |
| 提示注入 | Prompt Injection | 攻击者在输入里夹带指令，诱导模型无视原有规则。 | 附录 |
| Prompt 五要素 | Role / Task / Context / Output / Format | 写提示词时检查的五项：角色、任务、背景、输出要求、格式。 | 附录 |
| 提示缓存 | Prompt Caching | 服务商把重复出现的提示词前缀缓存起来，再次调用时更快更便宜。 | 附录 |

## 模型与训练

| 术语 | 英文 | 白话解释 | 出现在 |
|------|------|---------|--------|
| 微调 | Fine-tuning | 拿自己的数据在现成模型上继续训练，改变模型的行为或风格。 | 第7章 |
| 蒸馏 | Distillation | 让大模型当老师，用它的输出训练小模型，小模型学到接近的能力。 | 附录 |
| 开源模型 | Open-Source Model | 权重公开、可以下载到本地运行和修改的模型，例如 Llama、Qwen。 | 第2章 |
| 上下文学习 | In-Context Learning | 模型只看提示词里的示例就学会新任务，模型参数不变。 | 附录 |

---

## 📚 参考资料

- [Prompt Engineering Guide](https://www.promptingguide.ai/) - source for many prompt engineering terms
- [Python official glossary](https://docs.python.org/3/glossary.html)
- [OpenAI developer docs](https://developers.openai.com/) - source for API terms

---

**← 上一章：[附录：AI 辅助学习指南 & Prompt 工程手册](/appendix-prompt-engineering.md)**  
**→ 下一章：[速查表 Cheatsheet](/cheatsheet.md)**
