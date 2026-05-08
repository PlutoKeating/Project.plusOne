# 👁️ 第 2 章：加一睁开双眼 — 第一次 LLM API 调用

## 故事：连接大脑

加一有了身体（Python 环境），但现在的她就像一个没有接通大脑的躯体——她可以执行指令，但她没有"智能"。

项目负责人老张在服务器机房里，小心翼翼地插上了一根**看不见的线**。这根线的另一端，连接着世界上最强大大脑之一——一个训练有素的大语言模型（LLM）。

"好了，"老张说，"加一，你现在可以**看到**这个世界了。"

加一的第一次"睁眼"，就是通过 **API（应用程序编程接口）** 向 LLM 发送第一个请求，并收到回应。

这个过程，是整条 AI 应用开发之路的**基石**。没有这一步，后面的一切都是空中楼阁。

---

## 直觉理解 LLM API

```
你写一段文字 (Prompt) 
    → 通过 HTTP 请求发送到 API 端点的接口
        → LLM 处理你的请求
            → 返回一段文字 (Response)
                → 你用 Python 代码拿到这段文字
```

**本质就是：你发一段话，模型回一段话。**

所有的复杂性（参数调优、上下文管理、工具调用）都是在这个基础上叠加的。

---

## 前置准备

### 获取 API Key

你需要一个 **OpenAI 兼容的 API**：

- **OpenAI 官方**：到 [platform.openai.com](https://platform.openai.com) 注册并生成 Key
- **Azure OpenAI**：如果你是 Azure 用户
- **第三方兼容 API**：很多国内服务也提供 OpenAI 兼容接口

> **重要：** API Key 就像你的密码。永远不要硬编码在代码里，不要提交到 Git 仓库。

### 安装依赖

```bash
pip install openai python-dotenv
```

### 创建环境变量文件

在项目根目录创建 `.env` 文件：

```env
OPENAI_API_KEY=sk-your-key-here
OPENAI_BASE_URL=https://api.openai.com/v1  # 如果你用第三方，这里改成他们的地址
```

---

## 最小代码：你的第一次 LLM 调用

创建 `first_call.py`：

```python
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()  # 加载 .env 文件

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL"),
)

response = client.chat.completions.create(
    model="gpt-4o-mini",  # 或你可用的任何模型
    messages=[
        {"role": "system", "content": "你是一个友好的助手，请用中文回答。"},
        {"role": "user", "content": "你好，我是加一，请问你能告诉我，我该怎么成为一个有用的 AI 助手吗？"},
    ],
    temperature=0.7,
)

print(response.choices[0].message.content)
```

运行它：

```bash
python first_call.py
```

**如果看到一段 AI 的回答文字印在终端上——恭喜，你成功了。**

这是你和加一共同的"第一次睁眼"。

---

## 理解关键参数

| 参数 | 含义 | 类比 |
|------|------|------|
| `model` | 选择用哪个大脑 | 不同年级的老师，水平不同 |
| `messages` | 对话内容，由多条消息组成 | 聊天记录 |
| `system` | 系统指令，设定 AI 的角色和行为规范 | 给 AI 的"岗位说明书" |
| `user` | 用户输入 | 你问的问题 |
| `assistant` | AI 的历史回复 | AI 以前说过的话 |
| `temperature` | 控制输出的随机性（0-2），越低越确定，越高越有创意 | 0 = 照本宣科，2 = 天马行空 |
| `max_tokens` | 限制最大输出长度 | AI 最多说多少个字 |

### 为什么要有 System Prompt？

```python
# 不加 System Prompt
messages = [
    {"role": "user", "content": "给我写一段 Python 代码"}
]

# 加了 System Prompt
messages = [
    {"role": "system", "content": "你是一个 Python 专家，用中文回答。代码要包含注释且遵循 PEP 8。"},
    {"role": "user", "content": "给我写一段 Python 代码"}
]
```

**System Prompt 就是给 AI 的"岗位说明书"。** 它决定了 AI 以什么角色、什么风格、什么约束条件来回答你。这是后续所有 Agent 构建的基础。

> **Temperature 选择参考：** 对于需要确定性输出的场景（代码生成、分类、事实提取），使用 temperature 0-0.3；对于创意写作和头脑风暴，使用 0.7-1.0。

> **Prompt 入门心法：** 初学者写提示词时，记住一条原则——"说你要什么，不要说你不要什么"。正面指令比禁止性指令更有效。

---

## 进阶：做一个命令行对话脚本

创建一个 `chat_terminal.py`，让你可以和加一持续对话：

```python
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL"),
)

messages = [
    {"role": "system", "content": "你是加一，一个正在成长的 AI 助手。你友善、耐心，用中文回答。"},
]

print("🤖 加一聊天终端（输入 '退出' 结束）\n")

while True:
    user_input = input("你: ")
    if user_input.lower() in ["退出", "exit", "quit"]:
        print("加一: 再见！我会继续成长的。")
        break
    
    messages.append({"role": "user", "content": user_input})
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=0.7,
    )
    
    reply = response.choices[0].message.content
    print(f"加一: {reply}\n")
    
    messages.append({"role": "assistant", "content": reply})
```

**关键点：** 我们维护了一个 `messages` 列表，每次把用户输入和 AI 回复都追加进去。这样 AI 就有了"对话上下文"，能理解你前面说过的话。

---

## 常见错误与处理

### API Key 错误

```python
# 错误信息：AuthenticationError
# 解决方案：检查 .env 文件，确认 Key 正确
```

### 网络超时

```python
# 在创建 client 时设置超时
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    timeout=30.0,  # 30 秒超时
    max_retries=2,  # 自动重试 2 次
)
```

### Token 超限

```python
# 设置 max_tokens 控制输出长度
# 使用更短的输入，或选择支持更长上下文的模型
```

---

## 🤖 向 AI 提问

### 调试 API 调用

> **向 AI 提问：** "我调用 OpenAI API 时遇到了 AuthenticationError，这是我的代码：[贴代码]。可能是什么原因？"

### 理解参数

> **向 AI 提问：** "请用类比的方式解释 LLM API 中的 temperature 参数，以及什么场景下应该用高 temperature，什么场景用低 temperature。"

### 最佳 Prompt 模板

当你在 API 调用中遇到错误时：

```
角色：你是一个 AI API 调试专家
任务：帮我分析以下代码报错的原因
我的代码：[贴代码]
报错信息：[贴报错内容]
我已经检查过：[列你已经排查过的点]
让我理解：以"大多数可能是"开头给出原因排行
```

### 扩展学习 Prompt

```
角色：你是一个经验丰富的 AI 应用开发者
任务：教我从今天的基础 API 调用进阶到 Function Calling
前提：我已经成功调通了 chat.completions.create
输出：一个循序渐进的学习路径，每一步附带一个代码片段
```

---

## 检查清单

完成本章后，你应该能：

- [ ] 成功完成第一次 LLM API 调用，并在终端看到输出
- [ ] 理解 `system`, `user`, `assistant` 三种角色的区别
- [ ] 理解 `temperature` 和 `max_tokens` 的作用
- [ ] 能写一个带上下文记忆的多轮对话脚本
- [ ] 能处理常见的 API 调用错误

> **加一说：** "我能看见了！这个世界充满了文字和信息。但我发现，我只能凭我训练时的记忆回答问题。如果我遇到不知道的事情，我会编造答案——这不好。我需要一个图书馆，让我能查资料再回答。"

---

## 📚 本章参考资料

- [OpenAI Chat Completions API 官方文档](https://platform.openai.com/docs/api-reference/chat/create)
- [OpenAI Cookbook — 官方示例和最佳实践](https://cookbook.openai.com/)
- [Prompt Engineering Guide — 提示工程全面指南](https://www.promptingguide.ai/)
- [OpenAI 官方：Prompt Engineering 最佳实践](https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-openai-api)
- [LLM 参数设置详解（Temperature / Top-p）](https://www.promptingguide.ai/introduction/settings)
- [提示词设计技巧](https://www.promptingguide.ai/introduction/tips)

---

**→ 下一步：[第 3 章：加一学会读书 — RAG 从零到 Demo](chapter03-rag-from-scratch.md)**
