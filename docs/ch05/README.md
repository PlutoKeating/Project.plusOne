# 🧰 第 5 章：加一的工具箱与记忆库 — Tool, MCP, Memory

## 故事：工具箱与记忆库

加一学会调用工具后，问题也接踵而至。

有一天，老张检查加一的"工具箱"，发现是这样的场景：

- 天气工具：直接用 Python 函数
- 搜索工具：调 Web API，用 `requests` 库
- 发邮件工具：调公司的内部 SDK
- 查数据库工具：用另一个库

**每个工具的接入方式都不一样。** 每新增一个工具，就要写一堆胶水代码。

同时，老张还发现了另一个问题：加一**没有记忆**。

用户说"刚才我让你查了北京的天气，再帮我查一下上海的"，加一一脸茫然——"刚才？什么刚才？我们说过话吗？"

这一章，我们来解决两个关键问题：
1. **如何统一地管理工具？** → Tool 设计 + MCP 协议
2. **如何让 AI 记住东西？** → Memory 机制

---

## 第 1 部分：Tool — 工具设计原则

### 好的工具 = 好的函数

在前面一章我们已经写了不少工具了。一个好的工具，本质上就是**一个好的函数**：

```python
# ❌ 不好的工具
def do_stuff(data):
    # 什么都干，描述模糊
    pass

# ✅ 好的工具
def search_flights(
    departure: str, 
    destination: str, 
    date: str
) -> list[dict]:
    """
    查询指定日期从出发地到目的地的航班信息。
    
    Args:
        departure: 出发城市或机场代码
        destination: 到达城市或机场代码
        date: 日期，格式 YYYY-MM-DD
    
    Returns:
        航班列表，每个航班包含航班号、时间、价格
    """
    ...
```

> **工具设计的黄金法则：一个工具只做一件事，并且做好。**

### 工具规范清单

```python
def good_tool(
    # 1. 参数名要语义化（LLM 靠名字理解参数）
    param_one: str,
    # 2. 必须加类型注解（帮助 LLM 理解参数类型）
    param_two: int = 0,
    # 3. 必须有清晰的 docstring（这是 LLM 的"说明书"）
) -> str:
    """
    4. 描述工具做什么（给 LLM 看的）
    5. 描述每个参数的含义
    6. 描述返回值
    """
    # 7. 做好异常处理
    try:
        result = do_something(param_one, param_two)
        return str(result)
    except Exception as e:
        return f"工具执行出错: {e}"
```

---

## 第 2 部分：MCP — 标准化的工具接入

### 什么是 MCP？

**MCP（Model Context Protocol，模型上下文协议）** 是由 Anthropic 提出的开放标准协议，旨在规范 AI 模型如何发现和使用外部工具。

用一句话理解：

> **在没有 MCP 之前，每个工具就像不同品牌的充电器接口。MCP 就是 USB-C——一个统一的接口标准。**

### MCP 的核心思想

```
发现阶段：LLM / Agent 框架问 MCP Server → "你有什么工具？"
           MCP Server 返回工具列表（名称、描述、参数格式）
           
调用阶段：Agent 框架说 → "调用工具 X，参数是 Y"
           MCP Server 执行并返回结果
```

> **行业动态（2026）：** MCP 正在迅速成为 AI 工具集成的行业标准，已获得 Anthropic、OpenAI、Google 以及主流工具提供商的支持。对于 Agent 开发者来说，掌握 MCP 意味着你的工具可以一次编写、多处使用，不再被特定框架锁定。

### 最小 MCP Server 示例（概念性）

```python
# 这是一个概念示例，展示 MCP 的思想
# 实际 MCP 实现会更规范

class MCPTool:
    name: str
    description: str
    parameters: dict
    handler: callable

class MCPServer:
    def __init__(self):
        self.tools: dict[str, MCPTool] = {}
    
    def register_tool(self, tool: MCPTool):
        self.tools[tool.name] = tool
    
    def list_tools(self) -> list[dict]:
        """MCP 规范要求提供工具列表"""
        return [
            {
                "name": t.name,
                "description": t.description,
                "parameters": t.parameters,
            }
            for t in self.tools.values()
        ]
    
    def call_tool(self, name: str, arguments: dict) -> str:
        """MCP 规范要求提供工具调用接口"""
        if name not in self.tools:
            return f"错误: 未知工具 {name}"
        return self.tools[name].handler(**arguments)

# 使用
server = MCPServer()
server.register_tool(MCPTool(
    name="get_weather",
    description="查询城市天气",
    parameters={"city": "城市名称"},
    handler=lambda city: f"{city} 天气: 晴, 25°C",
))

# Agent 通过这个统一接口发现和调用工具
print(server.list_tools())
print(server.call_tool("get_weather", {"city": "北京"}))
```

> **对初学者来说，最重要的是理解 MCP 的核心理念：工具接入标准化。** 具体的 MCP 实现细节会在你的第二个 Agent 项目中去接触。

---

## 第 3 部分：Memory — 让 AI 记住事情

### 为什么需要 Memory？

```
用户：帮我查一下北京的天气。
加一：北京今天晴，25°C。

用户：那上海呢？      ← 这里的"那"指的是"天气"
加一：上海多云，28°C。 ← 因为没有记忆，上下文窗口里需要保留前一轮对话
```

Memory 要解决的核心问题是：**模型上下文窗口是有限的（通常 4K-128K tokens），对话一长，最早的内容就被"挤"出去了。**

### 短期记忆 vs 长期记忆

| 类型 | 机制 | 实现方式 |
|------|------|---------|
| **短期记忆** | 保留最近 N 轮对话 | 维护 `messages` 列表，用滑动窗口 |
| **长期记忆** | 压缩和总结历史信息 | 定期总结对话 + 向量检索 |

### 短期记忆实现

```python
from collections import deque

class ShortTermMemory:
    def __init__(self, max_rounds: int = 10):
        self.messages = deque(maxlen=max_rounds * 2)  # user + assistant
    
    def add_user(self, content: str):
        self.messages.append({"role": "user", "content": content})
    
    def add_assistant(self, content: str):
        self.messages.append({"role": "assistant", "content": content})
    
    def get_context(self, system_prompt: str = "") -> list[dict]:
        context = []
        if system_prompt:
            context.append({"role": "system", "content": system_prompt})
        context.extend(self.messages)
        return context

# 使用
memory = ShortTermMemory(max_rounds=5)
memory.add_user("帮我查北京的天气")
memory.add_assistant("北京今天晴，25°C")
print(memory.get_context("你是一个天气助手"))
```

### 长期记忆实现

长期记忆的核心逻辑：

```
每 N 轮对话 → 把历史对话总结成摘要 → 存入向量库
新对话开始时 → 检索相关历史摘要 → 拼入 Prompt
```

```python
import json
from sentence_transformers import SentenceTransformer

class LongTermMemory:
    def __init__(self):
        self.embedder = SentenceTransformer("all-MiniLM-L6-v2")
        self.summaries = []  # (summary_text, embedding)
        self.summarize_interval = 5  # 每 5 轮做一次总结
    
    def summarize_and_store(self, recent_messages: list[dict]):
        """把近期对话总结并存入长期记忆"""
        # 这里实际会调 LLM 做总结
        summary = f"用户询问了天气，助手回答了北京和上海的天气情况。"
        embedding = self.embedder.encode([summary])[0]
        self.summaries.append((summary, embedding))
    
    def retrieve_relevant(self, query: str, top_k: int = 2) -> list[str]:
        """检索与当前问题相关的历史记忆"""
        if not self.summaries:
            return []
        query_vec = self.embedder.encode([query])[0]
        # 简单实现：计算相似度（实际应使用向量库）
        scored = []
        for summary, emb in self.summaries:
            sim = sum(a * b for a, b in zip(query_vec, emb))
            scored.append((sim, summary))
        scored.sort(reverse=True)
        return [s for _, s in scored[:top_k]]
```

### 完整的带 Memory 的 Agent

```python
from openai import OpenAI
from dotenv import load_dotenv
import os
from collections import deque

load_dotenv()
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL"),
)

class AgentWithMemory:
    def __init__(self, system_prompt: str, max_rounds: int = 10):
        self.system_prompt = system_prompt
        self.messages = deque(maxlen=max_rounds * 2)
    
    def add_message(self, role: str, content: str):
        self.messages.append({"role": role, "content": content})
    
    def run(self, user_input: str) -> str:
        self.add_message("user", user_input)
        
        context = [{"role": "system", "content": self.system_prompt}]
        context.extend(self.messages)
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=context,
            temperature=0.7,
        )
        
        reply = response.choices[0].message.content
        self.add_message("assistant", reply)
        return reply

# 测试
agent = AgentWithMemory("你是友好的助手加一，用中文回答。")
print(agent.run("你好，我叫张三"))
print(agent.run("你还记得我叫什么名字吗？"))  # 因为有短期记忆，所以记得
```

---

## Tool、MCP、Memory 的关系

```
                    ┌──────────────────────┐
                    │       Agent          │
                    │                      │
     ┌──────────────┼──────────────┐       │
     │              │              │       │
     ▼              ▼              ▼       │
 ┌──────┐    ┌──────────┐    ┌────────┐   │
 │ Tool │    │   MCP    │    │ Memory │   │
 │ 工具 │    │ 标准化   │    │ 记忆   │   │
 └──────┘    └──────────┘    └────────┘   │
     │              │              │       │
 具体功能     统一接入方式      存储历史   │
     │              │              │       │
     ▼              ▼              ▼       │
 实际执行     工具发现与调用    上下文保留 │
 └──────────────┼──────────────┘           │
                │                          │
                └──────────────────────────┘
```

**三者的分工：**
- **Tool**：定义"能做什么"（功能实现）
- **MCP**：定义"怎么接入"（标准化接口）
- **Memory**：定义"记住什么"（上下文管理）

---

## 🤖 向 AI 提问

### 理解 MCP

> **向 AI 提问：** "请用简单的话解释 MCP 协议是什么，它在 Agent 架构中解决什么问题？我刚开始学习 Agent 开发。"

### 设计 Memory 机制

> **向 AI 提问：** "我想给一个客服 Agent 设计记忆系统，需要长期记忆和短期记忆结合。请给出架构设计思路和核心代码。"

### 最佳 Prompt 模板

```
角色：你是一个 AI 系统架构师
任务：帮我设计 [场景] 场景下的工具和记忆方案
场景描述：[描述你的应用场景]
要求：
1. 列出至少 5 个工具，每个工具包含 name, description, parameters
2. 设计记忆策略（短期记忆保留几轮？长期记忆如何总结和检索？）
输出格式：先给表格，再给核心代码
```

---

## 检查清单

完成本章后，你应该能：

- [ ] 理解 Tool 设计的基本原则
- [ ] 理解 MCP 的核心思想（工具接入标准化）
- [ ] 理解短期记忆和长期记忆的区别
- [ ] 能实现一个带滑动窗口记忆的 Agent
- [ ] 能设计一个简单的长期记忆方案

---

## 📚 参考资料

- [MCP 官方网站](https://modelcontextprotocol.io/) — Model Context Protocol 官方站点，包含入门指南和文档
- [MCP 规范](https://spec.modelcontextprotocol.io/) — MCP 协议完整规范文档
- [Anthropic MCP 公告](https://www.anthropic.com/news/model-context-protocol) — Anthropic 发布 MCP 的官方公告
- [MCP GitHub](https://github.com/modelcontextprotocol) — MCP 开源仓库，包含 SDK 和示例
- [LangGraph Memory Concepts](https://langchain-ai.github.io/langgraph/concepts/memory/) — LangGraph 框架中的记忆机制概念
- [LangChain Tool Concepts](https://python.langchain.com/docs/concepts/tools/) — LangChain 框架中的工具概念与用法

> **加一说：** "我的工具箱整齐了，记忆系统也装上了！现在我能做的事越来越多了。但有些任务太复杂了，我一个人忙不过来……也许我需要几个小伙伴来帮忙。"

---

**← 上一章：[第 4 章：加一学会动手 — Agent 核心循环](/ch04/)**  
**→ 下一章：[第 6 章：加一的团队 — Multi-Agent 何时用](/ch06/)**
