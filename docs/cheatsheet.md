# ⚡ 速查表 Cheatsheet

忘了流程或拿不准选哪个，来这里扫一眼。细节回对应章节查。

---

## 整个技术栈怎么叠起来

<div data-anim="app-stack-layers"></div>

*下层是上层的地基：没有 LLM 就没有 RAG，没有工具就没有 Agent。*

---

## 一次模型调用

```cards
icon: 🤖
title: model
what: 选哪个模型
like: 像选哪位主厨掌勺
use: 日常用小模型，难题换大模型

icon: 💬
title: messages
what: 对话列表，分 system / user / assistant
like: 像这一桌从头到尾的订单记录
use: 每次都带上历史，加一才记得前文

icon: 🎛️
title: temperature
what: 回答稳定还是发散
like: 像主厨的发挥空间：0 照菜谱，调高即兴
use: 分类 0–0.3；写作 0.7–1

icon: 📏
title: max_tokens
what: 回答长度上限
like: 像一道菜的分量上限
use: 按需设，防止长回答浪费钱
```

> **注意：** API Key、服务地址、模型名放 `.env`，代码只读取，不写死。

---

## RAG 流程

准备阶段，资料先入库：

```steps
icon: 📄
title: 文档
desc: 课程资料、说明书

icon: ✂️
title: 切块
desc: 约 500 字符一块，重叠 50–100

icon: 🔢
title: 向量化
desc: 中文内容选中文嵌入模型

icon: 🗄️
title: 存入向量库
desc: FAISS 或 ChromaDB
```

提问阶段，先查再答：

```steps
icon: ❓
title: 问题向量化

icon: 🎣
title: 找最近的 Top-K 段
desc: 起步取 3–5 段；结果杂乱再加重排序

icon: 🧩
title: 拼进提示词

icon: 💬
title: 模型照着资料回答
```

---

## Agent 循环（ReAct）

```text
问题 → 模型思考 ─要工具→ 程序执行 → 结果放回对话 → 回到"模型思考"
                └不要工具→ 最终回答        （设最大步数，到了就停）
```

一个工具定义有三样：

```cards
icon: 🏷️
title: 名称
what: 模型调用时用的名字
like: 像设备说明牌上写的名字
use: `get_weather`

icon: 📝
title: 描述
what: 做什么、什么时候用
like: 像说明牌上写的"能干什么"
use: 用户问天气时调用

icon: 🔣
title: 参数
what: 名字、类型、含义、是否必填
like: 像说明牌上写的"要放什么"
use: `city`：城市名，必填
```

> **建议：** 工具出错时，把错误信息当结果交给模型，程序别崩。

---

## 记忆

```cards
icon: 🗒️
title: 短期记忆
what: 只留最近 N 轮对话
like: 像出餐台的订单夹，新单挤掉旧单
use: 普通多轮聊天

icon: 🗃️
title: 长期记忆
what: 旧对话压成摘要入库，用时检索
like: 像老顾客档案本：爱吃辣、忌口
use: 记得几天前用户说过的事
```

## 多 Agent 模式

| 模式 | 结构 | 适合 |
|------|------|------|
| 流水线 | A → B → C 接力 | 步骤固定 |
| 协调者 + 工作者 | 拆任务、并行做、再汇总 | 子任务可并行 |
| 对话协作 | 多个 Agent 轮流讨论 | 要互相检查 |

---

## 选型速查

"用在哪"一栏写的是怎么选。

```cards
icon: 🗄️
title: 向量库
what: FAISS / ChromaDB / Pinecone
use: 本地练习用 ChromaDB 或 FAISS；要托管选 Pinecone

icon: 📚
title: RAG 框架
what: 手写 / LlamaIndex
use: 学原理先手写；要快用 LlamaIndex

icon: 🔧
title: Agent 框架
what: 手写 / LangChain / LangGraph
use: 单 Agent 手写；有分支循环用 LangGraph

icon: 👥
title: 多 Agent 框架
what: CrewAI / AutoGen / LangGraph
use: 按角色分工用 CrewAI；对话协作用 AutoGen

icon: 🎈
title: 界面
what: Streamlit
use: 几十行 Python 出网页，适合演示

icon: ☁️
title: 模型
what: 云端 API / 开源模型
use: 先用云端 API 跑通；有隐私要求再本地部署
```

> **提示：** Windows 上 FAISS 装不上，就直接换 ChromaDB。

---

## 常见错误速查

| 错误名 | 意思 | 先查什么 |
|------|------|------|
| AuthenticationError | 身份验证失败 | `.env` 里的 API Key |
| RateLimitError | 太频繁或额度用完 | 余额、调用频率 |
| TimeoutError | 等太久没回应 | 网络、超时设置 |
| BadRequestError | 请求格式不对 | 模型名、messages 结构 |
| APIConnectionError | 连不上服务 | 网络、服务地址 |

更多见 [故障排查 FAQ](/troubleshooting.md)。

---

## 📚 参考资料

- [OpenAI API docs](https://platform.openai.com/docs/) - for API reference
- [Streamlit docs](https://docs.streamlit.io/)
- [FAISS GitHub](https://github.com/facebookresearch/faiss)
- [ChromaDB docs](https://docs.trychroma.com/)

---

**← 上一章：[术语表 Glossary](/glossary.md)**  
**→ 下一章：[故障排查 FAQ](/troubleshooting.md)**
