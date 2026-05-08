# 📖 术语表 Glossary

## 核心概念

| 术语 | 英文 | 一句话解释 | 出现在 |
|------|------|-----------|--------|
| **大语言模型** | LLM (Large Language Model) | 经过海量文本训练的人工智能模型，能理解和生成人类语言 | 第2章 |
| **提示词** | Prompt | 你给 LLM 的输入文本，用于引导它生成你想要的输出 | 第2章 |
| **系统提示词** | System Prompt | 给 LLM 设定角色和行为规范的"岗位说明书" | 第2章 |
| **Temperature** | — | 控制 LLM 输出随机性的参数。越低越确定，越高越有创意 | 第2章 |
| **Token** | — | LLM 处理文本的最小单位，可以是一个词或一个字的一部分 | 第2章 |
| **上下文窗口** | Context Window | LLM 一次能"看到"的最大文本量（如 4K、128K tokens） | 第2章 |

## RAG 相关

| 术语 | 英文 | 一句话解释 | 出现在 |
|------|------|-----------|--------|
| **检索增强生成** | RAG (Retrieval-Augmented Generation) | 让 LLM 在回答前先检索知识库，基于资料生成答案的技术 | 第3章 |
| **幻觉** | Hallucination | LLM 生成看似合理但实际错误的内容 | 第3章 |
| **向量** | Vector/Embedding | 用一串数字表示文本的语义，语义相近的文本向量距离近 | 第3章 |
| **向量化** | Embedding | 把文本转换成向量的过程 | 第3章 |
| **向量库** | Vector Store / Vector Database | 专门存储和检索向量的数据库（如 FAISS、ChromaDB、Pinecone） | 第3章 |
| **切块** | Chunking | 把长文档切成小块，方便检索和处理 | 第3章 |
| **召回** | Retrieval | 根据用户问题从知识库中找到最相关的文档片段 | 第3章 |
| **相似度检索** | Similarity Search | 在向量库中找到与查询向量最接近的向量 | 第3章 |
| **重排序** | Rerank | 对检索结果用更精细的模型重新排序，提升准确率 | 第3章 |

## Agent 相关

| 术语 | 英文 | 一句话解释 | 出现在 |
|------|------|-----------|--------|
| **智能体** | Agent | 能自主感知、决策、执行行动的 AI 系统 | 第4章 |
| **函数调用** | Function Calling | LLM 输出结构化工具调用请求（工具名+参数）的能力 | 第4章 |
| **工具调用** | Tool Calling | Function Calling 的广义说法，不限于函数 | 第4章 |
| **ReAct** | Reasoning + Acting | Agent 的推理-行动交替循环模式 | 第4章 |
| **思维链** | Chain-of-Thought (CoT) | 让 LLM 分步推理再给出答案的技术 | 附录 |
| **少样本提示** | Few-Shot Prompting | 在 Prompt 中给出示例来引导 LLM 的输出格式和风格 | 附录 |

## Tool / MCP / Memory

| 术语 | 英文 | 一句话解释 | 出现在 |
|------|------|-----------|--------|
| **工具** | Tool | Agent 可以调用的外部功能（搜索、计算、发邮件等） | 第4/5章 |
| **模型上下文协议** | MCP (Model Context Protocol) | AI 工具接入的开放标准，类似"USB-C"接口 | 第5章 |
| **短期记忆** | Short-term Memory | 保留最近 N 轮对话，用滑动窗口实现 | 第5章 |
| **长期记忆** | Long-term Memory | 压缩和总结历史信息，需要时检索使用 | 第5章 |
| **对话历史** | Conversation History | 多轮对话中所有的 messages 列表 | 第2/5章 |

## 多 Agent

| 术语 | 英文 | 一句话解释 | 出现在 |
|------|------|-----------|--------|
| **多智能体系统** | Multi-Agent System | 多个 Agent 协同工作的系统 | 第6章 |
| **协调者** | Orchestrator | 在多 Agent 系统中负责任务分解和结果汇总的角色 | 第6章 |
| **工作者** | Worker | 执行具体子任务的 Agent | 第6章 |
| **流水线模式** | Pipeline Pattern | Agent 按固定顺序依次处理的工作模式 | 第6章 |

## 开发与工程

| 术语 | 英文 | 一句话解释 | 出现在 |
|------|------|-----------|--------|
| **API** | Application Programming Interface | 程序之间通信的接口 | 第2章 |
| **API Key** | — | 调用 API 的身份认证密钥 | 第2章 |
| **SDK** | Software Development Kit | 方便调用 API 的开发工具包（如 OpenAI Python SDK） | 第2章 |
| **环境变量** | Environment Variable | 存储在系统环境中的配置信息（如 API Key） | 第2章 |
| **虚拟环境** | Virtual Environment | Python 项目的独立依赖隔离环境 | 第1章 |
| **JSON** | JavaScript Object Notation | 一种轻量级的数据交换格式，常用于 API 通信 | 贯穿全书 |
| **Streamlit** | — | 快速搭建 AI 应用界面的 Python 框架 | 第3章 |

## Framework 框架相关

| 术语 | 英文 | 一句话解释 | 出现在 |
|------|------|-----------|--------|
| **LangChain** | — | 最流行的 LLM 应用开发框架，提供链式调用和 Agent 抽象 | 第4/6章 |
| **LangGraph** | — | LangChain 的图结构 Agent 编排框架 | 第6章 |
| **LlamaIndex** | — | 专注于 RAG 和数据索引的框架 | 第3章 |
| **Streamlit** | — | 快速搭建 AI 应用界面的 Python 框架 | 第3章 |
| **CrewAI** | — | 多 Agent 协作框架 | 第6章 |
| **AutoGen** | — | 微软的多 Agent 对话框架 | 第6章 |

## Prompt 工程相关

| 术语 | 英文 | 一句话解释 | 出现在 |
|------|------|-----------|--------|
| **零样本提示** | Zero-Shot Prompting | 不给示例，直接让 LLM 执行任务 | 附录 |
| **思维链** | Chain-of-Thought (CoT) | 让 LLM 分步推理的技术 | 附录 |
| **角色提示** | Role Prompting | 给 LLM 分配身份角色来优化回答 | 附录 |
| **提示注入** | Prompt Injection | 通过用户输入篡改系统指令的攻击方式 | 附录 |
| **TCOF 框架** | Task-Context-Output-Format | Prompt 设计的四要素框架 | 附录 |
| **提示缓存** | Prompt Caching | 缓存重复的 Prompt 部分以减少 API 成本 | 附录 |

## 模型与训练相关

| 术语 | 英文 | 一句话解释 | 出现在 |
|------|------|-----------|--------|
| **微调** | Fine-tuning | 在预训练模型上用特定数据继续训练，改变模型行为 | 第7章 |
| **蒸馏** | Distillation | 用大模型教小模型，让小模型获得大模型的能力 | 附录 |
| **开源模型** | Open-Source Model | 可以自由下载和修改的模型（如 Llama, Qwen） | 第2章 |
| **上下文学习** | In-Context Learning | 通过 Prompt 中的示例让 LLM 学会新任务，不改变参数 | 附录 |

---

> **提示：** 遇到不认识的术语时，随时回来看这里。每章末尾的"检查清单"中涉及的术语都在本表中有收录。

---

## 📚 参考资料

- [Prompt Engineering Guide](https://www.promptingguide.ai/) - source for many prompt engineering terms
- [Python official glossary](https://docs.python.org/3/glossary.html)
- [OpenAI developer docs](https://developers.openai.com/) - source for API terms
