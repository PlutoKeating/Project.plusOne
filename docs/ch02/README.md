# 👁️ 第 2 章：加一睁开双眼 — 第一次 LLM API 调用

## 故事：连接大脑

加一有了身体（Python 环境），还缺一个会思考的大脑。PlutoKeating 给她接上一根线，线的另一头是大语言模型（LLM）。她发出第一个请求、收到第一句回答，这就是"睁眼"。

---

## LLM API 是什么

API 像后厨的传菜窗口：服务员（你的程序）把订单递进去，主厨（LLM）做好菜，再从窗口递出来。

<div data-anim="ch02-api-roundtrip"></div>

*一次调用的往返：程序发请求，模型写回答，回答原路送回。*

---

## 调用前要准备什么

```cards
icon: 🔑
title: API Key
what: 证明"你是谁"的一串密钥
like: 像老板的记账卡号：凭它下单，按它扣费
use: 加一每次请求都带上它

icon: 🌐
title: Base URL
what: 请求寄往的地址
like: 后厨（服务商）的地址
use: 换用第三方兼容服务时改这里

icon: 🧰
title: SDK
what: 帮你打包、发送请求的程序库
like: 像点单机：把订单按格式填好送进窗口
use: 加一用它一行代码发出请求

icon: 🗄️
title: .env 文件
what: 本地存放 Key 和地址的文件
like: 老板抽屉里上锁的小本子
use: 代码从这里读 Key，**不提交到 Git**
```

> **注意：** API Key 等于密码，不写进代码，不进仓库。Key 可以在 [OpenAI 平台](https://platform.openai.com) 或兼容服务商处生成。

---

## 请求里装了什么

```cards
icon: 🎓
title: model
what: 选用哪个模型
like: 选哪位主厨
use: 加一选一个便宜又够用的模型

icon: 📜
title: messages
what: 按顺序排好的消息列表
like: 这一桌从头到尾的订单记录
use: 加一和你的**整段对话**都在这里

icon: ⚙️
title: system 角色
what: 给 AI 定身份和规则
like: 老板贴在后厨墙上的规矩
use: "你是加一，友善、用中文回答"

icon: 🙋
title: user 角色
what: 用户说的话
like: 顾客说的话
use: "帮我写一段 Python"

icon: 🤖
title: assistant 角色
what: AI 之前的回复
like: 主厨之前出过的菜
use: 让加一记得自己说过什么

icon: 🎲
title: temperature
what: 回答的随机程度，0–2
like: 主厨的发挥空间：0 照菜谱，调高就即兴
use: 写代码用 0–0.3，写文案用 0.7–1.0

icon: 📏
title: max_tokens
what: 回答长度上限
like: 一道菜的分量上限
use: token 是计价单位，按"字块"称重计费
```

> **建议：** System Prompt（系统提示词）直接说你要什么，效果好过列一堆禁止事项。

---

## 多轮对话：模型怎么"记住"上文

主厨记不住这桌点过什么，每次请求都从零开始。所以服务员每次都把整本订单记录一起递进去。

<div data-anim="ch02-multiturn-messages"></div>

*列表每轮变长，每次整包发送。*

```text
messages = [system: "你是加一，用中文回答"]
循环：
    messages 追加 (user, 用户输入)
    reply = 调用模型(messages)
    messages 追加 (assistant, reply)
```

> **注意：** 这个列表叫"对话上下文"。它越长，每次发送的 token 越多，花费也越多。

---

## 常见错误

```cards
icon: 🚫
title: 认证失败
what: Key 错了、过期了，或和地址不配
like: 记账卡号对不上，后厨不接单
use: 先查 `.env` 里的 Key 和 Base URL
color: red

icon: ⏳
title: 网络超时
what: 网络不稳或服务太忙
like: 饭点高峰，窗口迟迟不出菜
use: 设超时时间和自动重试次数
color: orange

icon: 📦
title: Token 超限
what: 输入加输出超过模型上限
like: 订单记录太厚，传菜窗口塞不进
use: 缩短输入、调小 `max_tokens` 或换长上下文模型
color: purple
```

---

## 🤖 向 AI 提问

> **调试报错：** "我调用 OpenAI API 时遇到了 AuthenticationError，这是我的代码和报错：[贴内容]。按可能性从高到低列出原因。"

> **理解参数：** "请用类比解释 LLM API 中的 temperature 参数，以及哪些场景该用高值、哪些场景该用低值。"

---

## 检查清单

- [ ] 完成第一次 LLM API 调用，并在终端看到输出
- [ ] 说出 `system`、`user`、`assistant` 三种角色的区别
- [ ] 说出 `temperature` 和 `max_tokens` 的作用
- [ ] 讲清多轮对话靠什么保留上下文
- [ ] 遇到认证、超时、超限错误时知道从哪里查

> **加一说：** "我能看见了！可我只会凭训练时的记忆回答，不知道的事会编。我需要一个菜谱库，先翻菜谱再做菜。"

---

## 📖 附加阅读
- [Self-Attention 自注意力机制：加一的大脑怎么读懂句子](/ch02/extra-01-self-attention.md)

## 📚 本章参考资料

- [OpenAI Chat Completions API 官方文档](https://platform.openai.com/docs/api-reference/chat/create)
- [OpenAI Cookbook — 官方示例和最佳实践](https://cookbook.openai.com/)
- [Prompt Engineering Guide — 提示工程全面指南](https://www.promptingguide.ai/)
- [OpenAI 官方：Prompt Engineering 最佳实践](https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-openai-api)
- [LLM 参数设置详解（Temperature / Top-p）](https://www.promptingguide.ai/introduction/settings)
- [提示词设计技巧](https://www.promptingguide.ai/introduction/tips)

---

**← 上一章：[第 1 章：打造加一的身体 — Python 快速起步](/ch01/)**  
**→ 下一章：[第 3 章：加一学会读书 — RAG 从零到 Demo](/ch03/)**
