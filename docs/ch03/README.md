# 📚 第 3 章：加一学会读书 — RAG 从零到 Demo

## 故事：加一的图书馆

加一虽然能说话了，但项目负责人 PlutoKeating 很快发现了一个严重的问题：

**加一会"编造答案"。**

用户问："我们公司 2024 年的财报数据是多少？"
加一回答了一个看起来很专业、但完全是虚构的数字。

这在 AI 领域被称为 **幻觉（Hallucination）** 。模型本质上是一个"高级文字接龙机器"，它没有实时数据，不知道你私有的知识，遇到不知道的事情，它会"自信地胡说"。

PlutoKeating 的解决方案是：**给加一建一个图书馆。**

这个图书馆，就是 **RAG（Retrieval-Augmented Generation，检索增强生成）**。

它的工作原理很简单：
1. 用户问问题
2. 加一先去图书馆查找相关文档
3. 基于查到的资料，再生成回答

就像考试时，从"闭卷"变成了"开卷"。

---

## RAG 核心链路

```
用户提问
    ↓
文档切块 (Chunking) — 把大文档切成小块
    ↓
向量化 (Embedding) — 把文字变成数学向量
    ↓
存入向量库 (Vector Store) — 建好索引方便检索
    ↓
语义召回 (Retrieval) — 找到和问题最相关的文档块
    ↓
Prompt 组装 — 把问题和检索到的资料拼在一起
    ↓
LLM 生成回答 — 基于资料生成最终回答
```

**你不是必须一次全都理解。** 先看流程，再逐个击破。

---

## 理解 Embedding：把文字变成坐标

Embedding 是 RAG 最核心的概念之一。

它的本质是：**把一段文字转换成一串数字（向量），让语义相近的文字在"数学空间"里离得近。**

```
"苹果很好吃"  →  [0.12, 0.45, -0.33, 0.78, ...]  ← 512 维向量
"香蕉很不错"  →  [0.15, 0.42, -0.30, 0.75, ...]  ← 距离近（语义相近）
"汽车跑得快"  →  [0.89, -0.12, 0.56, -0.44, ...] ← 距离远（语义无关）
```

> **直觉理解：** 就像在地图上，所有"水果"都聚集在一个区域，"交通工具"在另一个区域。Embedding 就是给每个词或句子一个"地图坐标"。

---

## 最小代码：基于 FAISS 的本地 RAG

### 安装依赖

```bash
pip install openai faiss-cpu sentence-transformers python-dotenv
```

> 如果你在 Windows 上遇到 faiss 安装问题，试试 `pip install faiss-cpu --no-build-isolation` 或使用 `chromadb` 替代。

### 第 1 步：准备你的知识库

创建一个 `knowledge_base.txt`：

```
PlutoKeating 是本项目的创始人，2018 年开始打造"加一"智能助手。
加一（plusOne）是项目打造的全方位智能助手，支持对话、检索和工具调用。
项目始于 2018 年，历经多年迭代，已具备完整的功能。
团队从 1 人起步，逐步发展为专注于 AI 助手开发的团队。
项目的使命是"让每个人都能拥有自己的 AI 助手"。
```

### 第 2 步：文档切块

```python
def chunk_text(text: str, chunk_size: int = 200, overlap: int = 20) -> list[str]:
    """把文本切成有重叠的块，避免切断语义"""
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        start = end - overlap  # 重叠，保证上下文连贯
    return chunks

with open("knowledge_base.txt", "r", encoding="utf-8") as f:
    text = f.read()

chunks = chunk_text(text)
print(f"切成了 {len(chunks)} 个文档块")
for i, chunk in enumerate(chunks):
    print(f"\n块 {i+1}: {chunk}")
```

### 第 3 步：向量化并存入向量库

```python
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

# 加载 Embedding 模型（将文字转成向量）
embedder = SentenceTransformer("all-MiniLM-L6-v2")

# 将每个文档块转成向量
chunk_vectors = embedder.encode(chunks)
dimension = chunk_vectors.shape[1]

# 创建 FAISS 索引
index = faiss.IndexFlatL2(dimension)  # 使用欧氏距离
index.add(np.array(chunk_vectors).astype("float32"))

print(f"向量库已建立，包含 {index.ntotal} 个向量")
```

### 第 4 步：检索 + 生成（完整 RAG）

```python
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL"),
)

def retrieve(query: str, top_k: int = 2) -> list[str]:
    """检索最相关的文档块"""
    query_vector = embedder.encode([query])
    distances, indices = index.search(np.array(query_vector).astype("float32"), top_k)
    return [chunks[i] for i in indices[0]]

def generate_answer(query: str, context_chunks: list[str]) -> str:
    """基于检索结果生成回答"""
    context = "\n\n".join(context_chunks)
    
    prompt = f"""请基于以下资料回答问题。如果资料中没有相关信息，请直接说"资料中没有提到"。

资料：
{context}

问题：{query}

回答："""
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "你是一个基于知识库回答问题的助手。只基于提供的资料回答，不要编造信息。"},
            {"role": "user", "content": prompt},
        ],
        temperature=0.3,  # 低 temperature，更准确
    )
    return response.choices[0].message.content

# 测试
question = "加一智能助手是什么时候创建的？"
retrieved = retrieve(question)
answer = generate_answer(question, retrieved)

print(f"问题: {question}")
print(f"检索到的资料: {retrieved}")
print(f"回答: {answer}")
```

### 第 5 步：用 Streamlit 搭建可视化 Demo

创建一个 `rag_demo.py`：

```python
import streamlit as st
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL"),
)

st.title("📚 加一的 RAG 知识库")
st.write("上传文档，然后基于文档内容提问")

# 初始化 Embedding 模型
@st.cache_resource
def load_embedder():
    return SentenceTransformer("all-MiniLM-L6-v2")

embedder = load_embedder()

# 初始化存储
if "index" not in st.session_state:
    st.session_state.index = None
    st.session_state.chunks = []

# 上传文档
uploaded_file = st.file_uploader("上传知识库文档（.txt）", type=["txt"])
if uploaded_file:
    text = uploaded_file.read().decode("utf-8")
    
    # 切块
    words = text.split()
    st.session_state.chunks = []
    for i in range(0, len(words), 150):
        chunk = " ".join(words[i:i+150])
        st.session_state.chunks.append(chunk)
    
    # 向量化
    vectors = embedder.encode(st.session_state.chunks)
    dimension = vectors.shape[1]
    st.session_state.index = faiss.IndexFlatL2(dimension)
    st.session_state.index.add(np.array(vectors).astype("float32"))
    
    st.success(f"文档已处理，共 {len(st.session_state.chunks)} 个文档块")

# 提问
query = st.text_input("输入你的问题：")
if query and st.session_state.index is not None:
    # 检索
    query_vector = embedder.encode([query])
    distances, indices = st.session_state.index.search(
        np.array(query_vector).astype("float32"), 2
    )
    retrieved = [st.session_state.chunks[i] for i in indices[0]]
    
    st.subheader("📄 检索到的资料")
    for i, chunk in enumerate(retrieved):
        st.text(f"片段 {i+1}: {chunk}")
    
    # 生成
    context = "\n\n".join(retrieved)
    prompt = f"基于以下资料回答问题：\n\n资料：{context}\n\n问题：{query}\n\n回答："
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )
    
    st.subheader("🤖 加一的回答")
    st.write(response.choices[0].message.content)
elif query and st.session_state.index is None:
    st.warning("请先上传文档")
```

运行它：

```bash
streamlit run rag_demo.py
```

> **你的第二个产出：** 一个能上传文档、能检索、能基于知识库回答问题的 RAG Demo。

---

## RAG 优化的方向（知道即可，不过度追求）

| 优化方向 | 怎么做 | 效果 |
|---------|-------|------|
| 更好的切块策略 | 按段落/语义切块，而非固定字数 | 提高召回质量 |
| 混合检索 | 结合关键词搜索（BM25）+ 语义搜索 | 召回更全面 |
| 重排序（Rerank） | 检索后用更精细的模型排序 | 提高 Top 结果准确率 |
| Prompt 优化 | 更清晰的指令，指定回答格式 | 回答更规范 |
| 多轮对话中的 RAG | 在对话上下文中结合检索 | 体验更连贯 |

> **✅ 先做成，再做好。** 没有一个优化值得你花一周时间在第一个 Demo 上。

> **"Lost in the Middle" 现象：** LLM 存在"迷失在中段"的问题——当上下文过长时，模型倾向于忽略中间位置的信息，而更关注开头和结尾。这也是为什么 RAG（只检索最相关的几段文本）比简单地把所有文档塞进 Prompt 效果更好的核心原因之一。

---

## 🤖 向 AI 提问

### 理解 Embedding

> **向 AI 提问：** "请用一句话加一个类比解释什么是 Embedding。我完全不懂数学。"

### 编写 RAG 代码

> **向 AI 提问：** "我想用 ChromaDB 替代 FAISS 来做向量存储，请帮我改写上面的代码，用 ChromaDB 替换 FAISS。"

### 调试 RAG 效果

> **向 AI 提问：** "我的 RAG 系统检索出来的结果不相关，这是我的代码：[贴代码]。请问可能是什么原因？怎么改进？"

### 最佳 Prompt 模板

```
角色：你是一个 RAG 系统架构师
任务：帮我设计一个 RAG 系统设计方案
上下文：我需要处理 [文档类型，如 PDF 合同]，用户会问 [问题类型，如"合同金额是多少"]
要求：给出技术选型建议（向量库、Embedding 模型、切块策略）
输出格式：先给架构图（文字描述），再给核心代码骨架，最后给出预期效果
```

---

## 检查清单

完成本章后，你应该能：

- [ ] 理解 RAG 的完整链路：切块 → Embedding → 向量库 → 召回 → 生成
- [ ] 能用 FAISS 搭建一个本地向量库
- [ ] 能完成一次"检索 + 生成"的完整 RAG 调用
- [ ] 能用 Streamlit 搭建可视化 Demo
- [ ] 理解为什么 RAG 能减少幻觉

> **加一说：** "太好了，我有了自己的图书馆！现在我可以查资料再回答了，不会再瞎编了。但是……我只能动口，不能动手。用户想让我帮忙发邮件、查天气、算数据，我都做不到。没有人教我怎么'做事'。"

---

## 📚 本章参考资料

- [Pinecone — RAG 系列教程](https://www.pinecone.io/learn/series/rag/)
- [Pinecone — 文档分块策略详解](https://www.pinecone.io/learn/chunking-strategies/)
- [LangChain — RAG 教程](https://python.langchain.com/docs/tutorials/rag/)
- [LlamaIndex — RAG 核心概念](https://docs.llamaindex.ai/en/stable/understanding/rag/)
- [MTEB Leaderboard — Embedding 模型排行榜](https://huggingface.co/spaces/mteb/leaderboard)
- [Ragas — RAG 系统评估框架](https://docs.ragas.io/)
- [论文：Lost in the Middle — 长上下文中的检索问题](https://arxiv.org/abs/2307.03172)

---

**← 上一章：[第 2 章：加一睁开双眼 — 第一次 LLM API 调用](/ch02/)**  
**→ 下一章：[第 4 章：加一学会动手 — Agent 核心循环](/ch04/)**
