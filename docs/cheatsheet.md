# ⚡ 速查表 Cheatsheet

> 开发过程中最常用的命令、代码片段和参数速查。

---

## Python 环境

```bash
# 创建虚拟环境
python -m venv venv

# 激活
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# 安装依赖
pip install openai python-dotenv sentence-transformers faiss-cpu streamlit
pip install chromadb  # 替代 FAISS

# 从 requirements.txt 安装
pip install -r requirements.txt

# 生成 requirements.txt
pip freeze > requirements.txt
```

---

## LLM API 调用

### 基础调用

```python
from openai import OpenAI
client = OpenAI(api_key="sk-xxx")

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "你是一个助手"},
        {"role": "user", "content": "你好"},
    ],
    temperature=0.7,
    max_tokens=1024,
)
print(response.choices[0].message.content)
```

### 关键参数速查

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `model` | str | — | 模型名称，如 `gpt-4o-mini`、`gpt-4` |
| `temperature` | float | 1.0 | 0-2，越低越确定，越高越有创意 |
| `max_tokens` | int | 4096 | 限制输出最大长度 |
| `top_p` | float | 1.0 | 核采样，与 temperature 二选一 |
| `frequency_penalty` | float | 0 | -2到2，抑制重复内容 |
| `presence_penalty` | float | 0 | -2到2，鼓励谈论新话题 |

### .env 文件模板

```env
OPENAI_API_KEY=sk-your-key-here
OPENAI_BASE_URL=https://api.openai.com/v1
MODEL_NAME=gpt-4o-mini
```

---

## RAG 核心代码片段

### 文档切块

```python
def chunk_text(text: str, chunk_size: int = 200, overlap: int = 20) -> list[str]:
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        end = start + chunk_size
        chunks.append(" ".join(words[start:end]))
        start = end - overlap
    return chunks
```

### Embedding + FAISS 索引

```python
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

embedder = SentenceTransformer("all-MiniLM-L6-v2")
vectors = embedder.encode(chunks)
index = faiss.IndexFlatL2(vectors.shape[1])
index.add(np.array(vectors).astype("float32"))

# 检索
query_vec = embedder.encode([query])
distances, indices = index.search(np.array(query_vec).astype("float32"), top_k=3)
results = [chunks[i] for i in indices[0]]
```

---

## Agent 工具定义规范

### OpenAI 标准格式

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "tool_name",
            "description": "工具描述（给 LLM 看的，越清晰越好）",
            "parameters": {
                "type": "object",
                "properties": {
                    "param1": {
                        "type": "string",
                        "description": "参数描述",
                    }
                },
                "required": ["param1"],
            },
        },
    }
]
```

### 工具实现的规范模板

```python
def my_tool(param1: str, param2: int = 0) -> str:
    """
    一句话描述工具功能。
    
    Args:
        param1: 参数描述
        param2: 参数描述，默认值
    Returns:
        返回描述
    """
    try:
        result = do_something(param1, param2)
        return str(result)
    except Exception as e:
        return f"工具执行出错: {e}"
```

---

## 记忆系统代码片段

### 短期记忆（滑动窗口）

```python
from collections import deque

class ShortTermMemory:
    def __init__(self, max_rounds: int = 10):
        self.messages = deque(maxlen=max_rounds * 2)
    
    def add(self, role: str, content: str):
        self.messages.append({"role": role, "content": content})
    
    def get_context(self, system_prompt: str = "") -> list[dict]:
        ctx = []
        if system_prompt:
            ctx.append({"role": "system", "content": system_prompt})
        ctx.extend(self.messages)
        return ctx
```

### 长期记忆（摘要 + 检索）

```python
class LongTermMemory:
    def __init__(self):
        self.embedder = SentenceTransformer("all-MiniLM-L6-v2")
        self.memories = []
    
    def store(self, summary: str):
        vec = self.embedder.encode([summary])[0]
        self.memories.append((summary, vec))
    
    def recall(self, query: str, top_k: int = 2) -> list[str]:
        q_vec = self.embedder.encode([query])[0]
        scored = [(sum(a*b for a,b in zip(q_vec, emb)), txt)
                  for txt, emb in self.memories]
        scored.sort(reverse=True)
        return [s for _, s in scored[:top_k]]
```

---

## ReAct Agent 循环骨架

```python
def run_agent(query: str, max_steps: int = 5) -> str:
    messages = [{"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": query}]
    
    for step in range(max_steps):
        response = client.chat.completions.create(
            model="gpt-4o-mini", messages=messages)
        reply = response.choices[0].message.content
        
        # LLM 决定使用工具
        if need_tool(reply):
            tool_name, params = parse_tool_call(reply)
            result = execute_tool(tool_name, params)
            messages.append({"role": "assistant", "content": reply})
            messages.append({"role": "user", "content": f"工具返回: {result}"})
        else:
            return reply  # 直接回答
    
    return "达到最大步骤限制"
```

---

## Streamlit 快速启动

```python
import streamlit as st

st.set_page_config(page_title="加一助手", layout="wide")
st.title("🤖 加一助手")

# 侧边栏
with st.sidebar:
    st.header("配置")
    api_key = st.text_input("API Key", type="password")
    model = st.selectbox("模型", ["gpt-4o-mini", "gpt-4"])

# 主区域
query = st.text_input("输入你的问题：")
if query:
    with st.spinner("加一正在思考..."):
        # 你的逻辑
        st.success("回答内容")
```

---

## 常见错误代码速查

| 错误 | 原因 | 解决 |
|------|------|------|
| `AuthenticationError` | API Key 错误或未设置 | 检查 `.env` 文件 |
| `RateLimitError` | 请求频率超限 | 降低请求频率，或升级账号 |
| `TimeoutError` | 请求超时 | 增加 timeout 参数 |
| `BadRequestError` | 参数错误 | 检查 model 名、messages 格式 |
| `APIConnectionError` | 网络无法连接 | 检查网络和 BASE_URL |
| `faiss` 安装失败 | Windows 编译问题 | 用 `pip install faiss-cpu --no-build-isolation` 或用 ChromaDB |

---

> **💡 提示：** 将此页面保存为浏览器书签，开发时随时查阅。

---

## 📚 参考资料

- [OpenAI API docs](https://platform.openai.com/docs/) - for API reference
- [Streamlit docs](https://docs.streamlit.io/)
- [FAISS GitHub](https://github.com/facebookresearch/faiss)
- [ChromaDB docs](https://docs.trychroma.com/)

---

**← 上一章：[术语表 Glossary](/glossary.md)**  
**→ 下一章：[故障排查 FAQ](/troubleshooting.md)**
