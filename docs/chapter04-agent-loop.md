# 🖐️ 第 4 章：小艾学会动手 — Agent 核心循环

## 故事：从"说话"到"做事"

小艾已经能说会道，还能查书了。但用户提出了新需求：

> "小艾，帮我查一下今天的天气。"
> "小艾，帮我算一下这个月的销售额总和。"
> "小艾，帮我给张三发一封邮件。"

小艾只能回答："抱歉，我只能提供文字回答。"

项目负责人老张意识到：**光有大脑和知识是不够的，小艾还需要"双手"——也就是执行行动的能力。**

一个能"做事"的 AI，就是 **Agent（智能体）**。

---

## 什么是 Agent？

最简单准确的定义：

```
Agent = Chatbot + Tools + Loop
```

| 组件 | 含义 | 小艾版 |
|------|------|--------|
| **Chatbot** | 能对话的 LLM | 小艾的大脑 |
| **Tools** | 模型可以调用的外部功能 | 小艾的双手 |
| **Loop** | 推理 → 行动 → 观察 → 推理的循环 | 小艾的"思考-行动"循环 |

**Agent 的核心不是框架，是循环。**

```
用户提问
    ↓
LLM 判断：我需要做什么？
    ↓
需要工具吗？───否──→ 直接回答用户
    ↓ 是
调用工具（搜索 / 计算 / API 等）
    ↓
拿到工具返回结果
    ↓
LLM 再次判断：结果够了吗？
    ↓ 不够，继续调用
    ↓ 够了
输出最终回答给用户
```

这个循环通常被称为 **ReAct（Reasoning + Acting，推理 + 行动）**。

---

## 理解 Function Calling

Function Calling（函数调用）是让 LLM 能"调用工具"的关键机制。

它的工作方式很巧妙：

1. **你告诉 LLM 有哪些工具可用**（工具名、参数说明）
2. **LLM 决定是否需要一个工具**——如果需要，它返回一个结构化的"调用请求"（工具名 + 参数）
3. **你的代码执行这个调用**——真正去调 API、查数据库等
4. **你把结果返回给 LLM**——LLM 基于结果继续推理

> **关键认知：LLM 并不真正执行代码。它只是告诉你"应该调用哪个工具、传什么参数"，实际执行的是你的 Python 代码。**

---

## 最小代码：手写一个 ReAct Agent

### 第 1 步：定义工具

```python
import requests
from datetime import datetime

def get_current_time() -> str:
    """获取当前时间"""
    return f"当前时间是: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"

def calculate(expression: str) -> str:
    """执行数学计算"""
    try:
        result = eval(expression)
        return f"计算结果: {result}"
    except Exception as e:
        return f"计算错误: {e}"

def get_weather(city: str) -> str:
    """模拟查询天气"""
    # 真实场景中这里会调用天气 API
    weather_data = {
        "北京": "晴，25°C",
        "上海": "多云，28°C",
        "广州": "小雨，30°C",
    }
    return weather_data.get(city, f"抱歉，没有 {city} 的天气数据")

# 工具注册表——告诉 LLM 有哪些工具可用
TOOLS = [
    {
        "name": "get_current_time",
        "description": "获取当前时间",
        "parameters": {},
    },
    {
        "name": "calculate",
        "description": "执行数学计算，如 '1 + 2 * 3'",
        "parameters": {"expression": "数学表达式字符串"},
    },
    {
        "name": "get_weather",
        "description": "查询城市天气",
        "parameters": {"city": "城市名称"},
    },
]

# 工具映射——实际执行的函数
TOOL_FUNCTIONS = {
    "get_current_time": get_current_time,
    "calculate": calculate,
    "get_weather": get_weather,
}
```

### 第 2 步：构建 Agent 循环

```python
import json
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL"),
)

def run_agent(user_query: str, max_steps: int = 5) -> str:
    """
    简单的 ReAct Agent。
    核心逻辑：LLM 决定是否调用工具 → 执行工具 → 继续推理。
    """
    # System Prompt：告诉 LLM 它可以使用工具
    system_prompt = f"""你是一个智能助手，可以使用工具来完成任务。
可用的工具：
{json.dumps(TOOLS, ensure_ascii=False, indent=2)}

当你需要使用工具时，请按以下格式返回：
工具名: [工具名称]
参数: [JSON 格式的参数]

当你可以直接回答时，请按以下格式返回：
回答: [你的回答]
"""
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_query},
    ]
    
    for step in range(max_steps):
        print(f"\n--- 第 {step + 1} 步 ---")
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.3,
        )
        
        reply = response.choices[0].message.content
        print(f"LLM 输出: {reply}")
        
        # 解析 LLM 的回复
        if reply.startswith("回答:"):
            return reply.replace("回答:", "").strip()
        
        elif reply.startswith("工具名:"):
            # 解析工具调用
            lines = reply.split("\n")
            tool_name = lines[0].replace("工具名:", "").strip()
            params_str = "\n".join(lines[1:]).replace("参数:", "").strip()
            params = json.loads(params_str) if params_str else {}
            
            # 执行工具
            if tool_name in TOOL_FUNCTIONS:
                print(f"🛠️ 调用工具: {tool_name}({params})")
                result = TOOL_FUNCTIONS[tool_name](**params)
                print(f"📦 工具返回: {result}")
                
                # 把结果放回对话
                messages.append({"role": "assistant", "content": reply})
                messages.append({
                    "role": "user",
                    "content": f"工具 {tool_name} 返回: {result}",
                })
            else:
                messages.append({
                    "role": "user",
                    "content": f"错误: 未知工具 {tool_name}",
                })
        else:
            return f"无法解析 LLM 回复: {reply}"
    
    return "达到最大步骤限制，请重试或简化问题。"

# 测试
queries = [
    "现在几点了？",
    "计算 25000 * 12 * 0.15 等于多少？",
    "北京的天气怎么样？",
    "帮我查一下北京的天气，然后计算 100 + 200 等于多少？",
]

for q in queries:
    print(f"\n\n用户: {q}")
    print(f"小艾: {run_agent(q)}")
```

> **注意：** 这个实现是教学用的简化版本。真正的 Agent 框架会用更标准的方式处理工具调用（如 OpenAI 的 `tools` 参数）。但核心逻辑一模一样。

---

## 用 OpenAI 的工具调用（Tool Calling）标准方式

上面的手写版本展示了原理。实际项目中，你会用 OpenAI 原生的 `tools` 参数：

```python
import json
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL"),
)

# 用 OpenAI 标准格式定义工具
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "查询城市天气",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "城市名称",
                    }
                },
                "required": ["city"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "calculate",
            "description": "执行数学计算",
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {
                        "type": "string",
                        "description": "数学表达式",
                    }
                },
                "required": ["expression"],
            },
        },
    },
]

# 工具实现
def get_weather(city: str) -> str:
    weather_data = {"北京": "晴，25°C", "上海": "多云，28°C"}
    return weather_data.get(city, f"没有 {city} 的数据")

def calculate(expression: str) -> str:
    try:
        return str(eval(expression))
    except Exception as e:
        return f"错误: {e}"

tool_map = {"get_weather": get_weather, "calculate": calculate}

# Agent 循环
messages = [{"role": "user", "content": "北京的天气怎么样？顺便算一下 25 * 4"}]

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=messages,
    tools=tools,
    tool_choice="auto",
)

assistant_message = response.choices[0].message
messages.append(assistant_message)

# 处理工具调用
if assistant_message.tool_calls:
    for tool_call in assistant_message.tool_calls:
        func_name = tool_call.function.name
        func_args = json.loads(tool_call.function.arguments)
        print(f"🛠️ 调用: {func_name}({func_args})")
        
        result = tool_map[func_name](**func_args)
        messages.append({
            "role": "tool",
            "tool_call_id": tool_call.id,
            "content": result,
        })
    
    # 把工具返回结果发给 LLM，生成最终回答
    final_response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
    )
    print(f"小艾: {final_response.choices[0].message.content}")
```

---

## Agent 设计的核心原则

### 1. 工具设计要简单清晰

```python
# ❌ 不好的工具设计：一个大而全的工具
def do_everything(action: str, params: dict) -> str:
    ...

# ✅ 好的工具设计：每个工具做一件事
def search_web(query: str) -> str: ...
def send_email(to: str, subject: str, body: str) -> str: ...
def calculate(expression: str) -> str: ...
```

### 2. 提供清晰的工具描述

LLM 是靠工具描述来决定用哪个工具的。描述越清晰，它选对的概率越高。

```python
# ❌ 模糊
{"name": "search", "description": "搜索"}

# ✅ 清晰
{"name": "search_web", "description": "搜索互联网获取最新信息，适用于查询新闻、实时数据等"}
```

### 3. 总是限制最大循环步数

```python
def run_agent(query: str, max_steps: int = 5):
    """没有 max_steps，Agent 可能陷入死循环"""
```

### 4. 做好错误处理

工具调用可能失败：网络超时、API 返回错误、参数不合法。**你的 Agent 应该能优雅地处理失败，而不是直接崩溃。**

---

## 🤖 向 AI 提问

### 设计工具

> **向 AI 提问：** "我想给我的 Agent 添加一个搜索网页的工具。请帮我设计工具的接口、参数和实现代码。"

### 理解 Agent 循环

> **向 AI 提问：** "请用伪代码解释 ReAct 模式的 Agent 循环，帮我理清 reasoning 和 acting 是怎么交替进行的。"

### 调试 Tool Calling

> **向 AI 提问：** "我的工具调用没有触发，LLM 直接回答了而没有调用工具。这是我的工具定义：[贴代码]。可能是什么原因？"

### 最佳 Prompt 模板

```
角色：你是一个 Agent 系统开发者
任务：帮我设计一个 [场景] 场景下的 Agent 工具集
场景：例如"一个客服 Agent，需要查询订单、退货、物流信息"
要求：给出每个工具的 name, description, parameters（JSON Schema 格式）
输出格式：按优先级排序的工具列表，附带选择理由
```

---

## 检查清单

完成本章后，你应该能：

- [ ] 用自己的话解释 Agent = Chatbot + Tools + Loop
- [ ] 理解 Function Calling 的原理
- [ ] 能手写一个简化版 ReAct 循环
- [ ] 能用 OpenAI 标准 `tools` 参数实现 Tool Calling
- [ ] 理解工具设计的基本原则

> **小艾说：** "太好了！我现在不仅会说话，还会做事了！但是……我的工具管理越来越乱了，每个工具接入方式都不一样。而且我跟用户聊完就忘，完全没有记忆。我需要一个工具箱规范和一个记忆系统。"

---

**→ 下一步：[第 5 章：小艾的工具箱与记忆库 — Tool, MCP, Memory](chapter05-tool-mcp-memory.md)**
