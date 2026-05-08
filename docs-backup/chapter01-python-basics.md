# 🧱 第 1 章：打造加一的身体 — Python 快速起步

## 故事：加一需要一具"身体"

加一要成为一个 AI 助手，首先需要一具能够执行指令的"身体"。

想象一下：加一是一个婴儿，她的大脑（我们之后会用 LLM 来充当）是世界上最聪明的大脑之一，但她现在连"动一下手指"都做不到。她需要一个能理解指令、执行动作、与世界交互的载体。

在 AI 开发的世界里，**Python 就是这个载体**。

Python 之于 AI 开发者，就像身体之于灵魂——它是你所有想法落地的媒介。你不会用它来做所有事情，但**没有它，什么都做不了**。

---

## 需要学到什么程度？

很多新手最大的误区：**"我要先把 Python 学透了再开始做 AI。"**

这是错的。

你不需要学会 Python 的一切才开始。你需要的是**最小可行知识集**——够你起步就行。

| 知识点 | 为什么需要 | 优先级 |
|--------|-----------|--------|
| 变量与基本数据类型 | 存储 API Key、用户输入等 | ⭐⭐⭐⭐⭐ |
| 字符串操作 | 构造 Prompt、处理 LLM 输出 | ⭐⭐⭐⭐⭐ |
| 列表与字典 | 管理工具列表、配置信息 | ⭐⭐⭐⭐⭐ |
| 函数定义 | 封装工具调用逻辑 | ⭐⭐⭐⭐⭐ |
| 类与对象 | 理解 SDK 中的 Client 概念 | ⭐⭐⭐⭐ |
| 文件读写 | 读取文档、保存结果 | ⭐⭐⭐⭐ |
| `requests` / `httpx` 库 | 调用 LLM API | ⭐⭐⭐⭐⭐ |
| `try / except` | 处理 API 调用失败 | ⭐⭐⭐⭐ |
| 虚拟环境 | 隔离项目依赖 | ⭐⭐⭐ |

> **记住：** 你不需要成为 Python 专家。你需要的是"能写能跑"的能力。剩下的，遇到什么学什么。

---

## 15 分钟快速速通

### 1. 变量与类型

```python
# 你只需要知道这几种类型
name = "加一"             # 字符串 str
age = 0                   # 整数 int  
temperature = 0.7         # 浮点数 float
tools = ["搜索", "计算"]   # 列表 list
config = {"model": "gpt-4", "key": "sk-xxx"}  # 字典 dict
is_ready = False           # 布尔 bool

# print() 是你最好的调试朋友
print(f"加一的年龄: {age}, 准备就绪: {is_ready}")
```

### 2. 字符串操作 — 你用得最多

```python
# 构造 Prompt 的核心技能
system_prompt = "你是一个有用的助手"
user_input = "今天天气怎么样？"
full_prompt = f"{system_prompt}\n\n用户问: {user_input}"
print(full_prompt)

# 处理 LLM 返回结果
response = "  当然可以！我来帮你...  "
clean = response.strip()          # 去空格
lines = response.split("\n")      # 按行拆分
has_error = "抱歉" in response     # 关键词检测
```

### 3. 列表与字典 — 管理一切

```python
# 工具列表
tools = [
    {"name": "搜索网页", "endpoint": "/api/search"},
    {"name": "计算数学", "endpoint": "/api/calc"},
]

# 遍历工具
for tool in tools:
    print(f"工具有: {tool['name']}")

# 给列表添加新工具
tools.append({"name": "发送邮件", "endpoint": "/api/email"})
```

### 4. 函数 — 你的基本封装单元

```python
def call_llm(prompt: str, temperature: float = 0.7) -> str:
    """
    调用大模型的核心函数。
    现在先理解结构，下一章我们真的去调 API。
    """
    # 这里暂时用伪代码
    result = f"[模拟返回] 针对 '{prompt[:20]}...' 的回答"
    return result

# 调用
answer = call_llm("今天天气怎么样？")
print(answer)
```

### 5. 异常处理 — 保命技能

```python
import requests

def safe_api_call(url: str):
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()  # 检查 HTTP 错误
        return response.json()
    except requests.exceptions.Timeout:
        return {"error": "请求超时了"}
    except requests.exceptions.RequestException as e:
         return {"error": f"请求失败: {e}"}
```

### 6. JSON 解析 — LLM API 返回的核心数据格式

```python
import json

# 模拟一个 LLM API 的返回结果
api_response = '''
{
  "id": "chatcmpl-abc123",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "你好！我是加一，有什么可以帮你的？"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 15,
    "completion_tokens": 20,
    "total_tokens": 35
  }
}
'''

# 解析 JSON 字符串
data = json.loads(api_response)

# 提取 LLM 的回复内容
reply = data["choices"][0]["message"]["content"]
tokens_used = data["usage"]["total_tokens"]

print(f"加一说: {reply}")
print(f"本次消耗 token: {tokens_used}")

# 将 Python 对象转回 JSON 字符串（发送请求时用）
new_request = {
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "你好"}]
}
json_str = json.dumps(new_request, ensure_ascii=False)
print(json_str)
```

### 7. datetime — 时间处理，日志与 Token 过期判断必备

```python
from datetime import datetime, timedelta
import time

# 获取当前时间
now = datetime.now()
print(f"当前时间: {now.strftime('%Y-%m-%d %H:%M:%S')}")

# API Key 的过期时间判断
token_expires_at = datetime(2025, 6, 1, 12, 0, 0)
if now > token_expires_at:
    print("⚠️ API Key 已过期！请更换新的 Key。")
else:
    remaining = token_expires_at - now
    print(f"✅ API Key 有效，剩余 {remaining.days} 天。")

# 计算 API 响应时间（做性能调试时常用）
start_time = time.time()
time.sleep(0.5)  # 模拟一次 API 调用
elapsed = time.time() - start_time
print(f"API 调用耗时: {elapsed:.2f} 秒")
```

---

## 🐍 虚拟环境：给加一一个干净的工作空间

在真实项目中，不同项目可能依赖同一个库的不同版本。**虚拟环境**就是为每个项目创建一个独立的 Python 运行环境，互不干扰。

### Windows / macOS / Linux 通用步骤

```bash
# 1. 创建项目文件夹
mkdir xiaoai-project
cd xiaoai-project

# 2. 创建虚拟环境（Windows 用 python，macOS/Linux 用 python3）
python -m venv venv

# 3. 激活虚拟环境
#    Windows (PowerShell):
venv\Scripts\Activate.ps1
#    如果报错，先执行: Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
#
#    Windows (CMD):
venv\Scripts\activate.bat
#
#    macOS / Linux:
source venv/bin/activate

# 4. 确认激活成功——终端提示符前会出现 (venv)：
#    (venv) C:\Users\...\xiaoai-project>

# 5. 安装依赖（比如 requests）
pip install requests

# 6. 退出虚拟环境（用完可以退出）
deactivate
```

> **💡 习惯养成：** 每开始一个新项目，第一步就是 `python -m venv venv`。这是职业开发者的肌肉记忆。

---

## 🛠️ 最小代码：你的第一个 Python 脚本

创建一个文件 `hello_xiaoai.py`：

```python
print("=" * 50)
print("加一的初始化程序")
print("=" * 50)

# 加一的基本信息
name = "加一"
version = "0.0.1"
skills = ["对话", "查资料", "做计算"]

print(f"\n🤖 你好！我是 {name}")
print(f"📌 版本: {version}")
print(f"🎯 技能: {', '.join(skills)}")

# 一个简单的对话模拟
while True:
    user_input = input("\n💬 你对加一说: ")
    if user_input == "退出":
        print("加一: 再见！")
        break
    
    response = f"加一: 你说的是「{user_input}」对吗？我现在还在学习中，等学会调用 API 就能真正回答你了。"
    print(response)
```

运行它：

```bash
python hello_xiaoai.py
```

> **你的第一个产出：** 一个能在终端交互的"模拟助手"。虽然它现在只能回声复读，但你已经跑起来了。

---

## 🤖 向 AI 提问

本章的 AI 辅助学习建议：

### 如果某个概念不理解

> **向 AI 提问：** "请用生活类比的方式解释 Python 中的字典（dict）是什么？我刚开始学编程。"

### 需要更多练习

> **向 AI 提问：** "请给我出 5 道 Python 基础练习题，难度依次递增，主题围绕字符串处理和列表操作。每道题请附带预期输出。"

### 最佳 Prompt 模板

```
角色：你是一个擅长类比教学的编程导师
任务：用不超过 200 字解释 [概念名称]
受众：零编程基础的成人学习者
要求：必须使用一个生活场景的比喻，禁止直接抄定义
输出格式：先一句话总结，再用比喻展开
```

### 学习策略建议

用 AI 辅助学习 Python 时，遵循 **"三遍法"**：

1. **第一遍：让 AI 讲解概念** — 用上面的 Prompt 模板
2. **第二遍：让 AI 出题** — 做 3-5 道练习题
3. **第三遍：让 AI 做代码审查** — 写完代码后发给 AI："请审查我的代码，指出可以改进的地方"

---

## 检查清单

完成本章后，你应该能：

- [ ] 在电脑上成功运行了一个 `.py` 文件
- [ ] 理解变量、字符串、列表、字典的基本用法
- [ ] 能写出一个带参数的函数
- [ ] 能使用 `try / except` 处理错误
- [ ] 能用 `requests` 库发送 HTTP 请求
- [ ] 运行了 `hello_xiaoai.py` 并看到了输出

> **加一说：** "身体搭好了，下一步让我睁开眼睛——看看这个世界吧！"

---

## 📚 本章参考资料

- [Python 官方教程](https://docs.python.org/3/tutorial/) — 最权威的 Python 入门指南，一步步带你掌握语言核心
- [Real Python](https://realpython.com/) — 高质量 Python 教程，从基础到高级，所有代码均可在线运行
- [W3Schools Python Tutorial](https://www.w3schools.com/python/) — 零基础友好的交互式 Python 学习平台
- [LearnPython.org](https://www.learnpython.org/) — 免费在线交互式 Python 教程，无需安装，浏览器即学即练

---

**→ 下一步：[第 2 章：加一睁开双眼 — 第一次 LLM API 调用](chapter02-first-api-call.md)**
