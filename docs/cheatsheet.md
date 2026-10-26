# ⚡ 速查表 Cheatsheet

开发时忘了某个流程或该选哪个方案，来这里扫一眼。代码细节回到对应章节查。

---

## 一次模型调用由什么组成

```text
程序 ──请求──▶ 模型服务
        ├─ model         用哪个模型
        ├─ messages      对话列表（system / user / assistant 三种角色）
        ├─ temperature   随机程度
        └─ max_tokens    回答长度上限
程序 ◀──回答── 模型服务
```

| 参数 | 作用 | 常用取值 |
|------|------|---------|
| model | 选模型 | 便宜快速的小模型做日常，复杂推理换大模型 |
| temperature | 回答稳定还是发散 | 抽取、分类用 0–0.3；写作、头脑风暴用 0.7–1 |
| max_tokens | 回答最长多少 Token | 按需要设，防止超长回答浪费费用 |
| top_p | 另一种控制随机的方式 | 与 temperature 调一个就够 |

配置放在 `.env` 文件里：API Key、服务地址、模型名。代码只读取，不写死。

---

## RAG 流程

```text
准备阶段：文档 → 切块 → 向量化 → 存入向量库
提问阶段：问题 → 向量化 → 相似度检索 Top-K 段落 → 拼进提示词 → 模型回答
```

| 环节 | 要决定什么 | 起步建议 |
|------|-----------|---------|
| 切块 | 每块多大、相邻块重叠多少 | 约 500 字符，重叠 50–100 |
| 向量化 | 用哪个嵌入模型 | 中文内容选中文嵌入模型 |
| 检索 | 取回几段（Top-K） | 3–5 段 |
| 重排序 | 是否再精排一次 | 召回结果杂乱时再加 |

---

## Agent 循环（ReAct）

```text
用户问题
   ↓
模型思考 ──需要工具──▶ 程序执行工具 ──结果──▶ 放回对话 ──┐
   │                                                      │
   │◀─────────────────────────────────────────────────────┘
   └──不需要工具──▶ 给出最终回答
（设置最大步数，到了就停）
```

一个工具定义包含三样东西：

| 部分 | 说明 |
|------|------|
| 名称 | 模型调用时用的名字 |
| 描述 | 写给模型看：这个工具做什么、什么情况下用 |
| 参数 | 每个参数的名字、类型、含义，以及哪些必填 |

工具执行出错时，把错误信息作为结果返回给模型，程序不要直接崩溃。

---

## 记忆

| 类型 | 做法 | 适合 |
|------|------|------|
| 短期记忆 | 只保留最近 N 轮对话 | 普通多轮聊天 |
| 长期记忆 | 历史对话压缩成摘要存入向量库，用时检索 | 需要记住几天前的事 |

```text
每轮对话：用户消息加入历史 → 历史 + 系统提示词发给模型 → 回答加入历史
历史太长：丢掉最早的几轮，或把它们总结成一段摘要
```

---

## 多 Agent 模式

| 模式 | 结构 | 适合 |
|------|------|------|
| 流水线 | A → B → C 依次接力 | 步骤固定的任务，如"搜集 → 写稿 → 审校" |
| 协调者 + 工作者 | 协调者拆任务派给多个工作者，再汇总 | 子任务可以并行 |
| 对话协作 | 多个 Agent 轮流发言讨论 | 需要互相检查、辩论 |

---

## 选型速查

| 要做的事 | 可选方案 | 怎么选 |
|---------|---------|--------|
| 向量库 | FAISS / ChromaDB / Pinecone | 本地练习用 FAISS 或 ChromaDB；FAISS 装不上就用 ChromaDB；要托管服务选 Pinecone |
| RAG 框架 | 手写 / LlamaIndex / LangChain | 学原理先手写；要快速搭建用 LlamaIndex |
| Agent 框架 | 手写 / LangChain / LangGraph | 单 Agent 手写即可；流程有分支和循环用 LangGraph |
| 多 Agent 框架 | CrewAI / AutoGen / LangGraph | 按角色分工用 CrewAI；Agent 间对话协作用 AutoGen |
| 界面 | Streamlit | 几十行 Python 出网页，适合演示 |
| 模型 | 云端 API / 开源模型 | 先用云端 API 跑通；有隐私或成本要求再考虑本地部署开源模型 |

---

## 常见错误速查

| 错误名 | 意思 | 先查什么 |
|------|------|------|
| AuthenticationError | 身份验证失败 | `.env` 里的 API Key |
| RateLimitError | 请求太频繁或额度用完 | 账户余额、调用频率 |
| TimeoutError | 等太久没回应 | 网络、超时设置 |
| BadRequestError | 请求格式不对 | 模型名、messages 结构 |
| APIConnectionError | 连不上服务 | 网络、服务地址 |

更多问题见 [故障排查 FAQ](/troubleshooting.md)。

---

## 📚 参考资料

- [OpenAI API docs](https://platform.openai.com/docs/) - for API reference
- [Streamlit docs](https://docs.streamlit.io/)
- [FAISS GitHub](https://github.com/facebookresearch/faiss)
- [ChromaDB docs](https://docs.trychroma.com/)

---

**← 上一章：[术语表 Glossary](/glossary.md)**  
**→ 下一章：[故障排查 FAQ](/troubleshooting.md)**
