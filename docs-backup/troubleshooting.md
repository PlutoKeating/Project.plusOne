# 🐛 常见问题排查指南 Troubleshooting & FAQ

> 本页面收集了从零开始学 Agent 开发时最常见的 20 个问题。遇到报错时，先来这里查。

---

## 环境搭建

### Q1：Python 安装后命令行找不到 python 命令？

```
Windows: 安装时勾选 "Add Python to PATH"，或手动添加到系统环境变量
Mac:    使用 brew install python
Linux:  使用系统包管理器或 pyenv

验证：python --version
```

### Q2：pip install 报 SSL 证书错误？

```bash
# 临时方案
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org 包名

# 长期方案：升级 pip
python -m pip install --upgrade pip
```

### Q3：虚拟环境无法激活？

```bash
# Windows PowerShell 执行策略问题
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 确认你在正确的目录
# 应该能看到 venv/Scripts/activate (Windows) 或 venv/bin/activate (macOS/Linux)
```

---

## API 调用

### Q4：AuthenticationError：Incorrect API key provided

```
1. 检查 .env 文件中的 KEY 是否完整复制（没有多余空格）
2. 检查 load_dotenv() 是否在创建 client 之前调用
3. 检查 .env 文件是否在项目根目录
4. 如果 KEY 以 sk-proj- 开头，确认用的是正确的 project key
```

### Q5：RateLimitError：You exceeded your current quota

```
1. 检查 OpenAI 账户余额：platform.openai.com/usage
2. 新账户通常有免费额度，用完需要充值
3. 降低请求频率：在调用之间加 time.sleep(1)
4. 考虑使用更便宜的模型（gpt-4o-mini 替代 gpt-4o）
```

### Q6：API 返回超时 Timeout

```
可能原因：
- 网络问题（国内访问 OpenAI 可能需要代理）
- 模型响应慢

解决方案：
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL"),  # 如果使用代理或第三方
    timeout=60.0,  # 增加到 60 秒
    max_retries=3,
)
```

### Q7：httpx.HTTPStatusError：404

```
可能原因：
- base_url 设置错误
- 模型名拼写错误（如 gpt-4o-mini 写成了 gpt-4-mini）

检查你的 OPENAI_BASE_URL 和 model 参数是否正确。
```

---

## RAG / 向量库

### Q8：faiss-cpu 安装失败（Windows）

```
方案 1：使用 conda
conda install -c conda-forge faiss-cpu

方案 2：换 ChromaDB（推荐）
pip install chromadb

方案 3：使用纯 Python 方案
pip install numpy  # 用 numpy 实现简单的相似度搜索
```

### Q9：sentence-transformers 下载模型失败

```
可能原因：国内无法访问 HuggingFace

解决方案：
1. 设置镜像：
   export HF_ENDPOINT=https://hf-mirror.com

2. 或者手动下载模型到本地：
   从 https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2 下载
   放到 ./models/ 目录下
   加载时指定路径：SentenceTransformer("./models/all-MiniLM-L6-v2")
```

### Q10：RAG 检索结果不相关

```
排查顺序：
1. 检查切块大小：chunk_size 是否太大？建议从 500 字符开始调
2. 检查重叠：chunk_overlap 太小可能切断语义，建议 50-100
3. 检查 Embedding 模型：中文内容用 m3e-base 或 text2vec 比英文模型好很多
4. 检查用户问题是否被正确向量化
5. 把 top_k 从 2 调到 10 看是没召回到还是排序问题
6. 打印检索到的文档块内容，人工判断相关性
```

### Q11：ChromaDB 或 FAISS 索引为空

```python
# 常见错误：忘记在检索前执行 add
# 确保你的流程是：embed → add → search
print(f"索引中的向量数: {index.ntotal}")  # FAISS
print(f"集合中的文档数: {collection.count()}")  # ChromaDB
```

---

## Agent / Tool Calling

### Q12：LLM 不调用工具，直接回答

```
可能原因：
1. 工具描述不够清晰：LLM 不知道什么时候该用
2. tool_choice 设置问题：设为 "auto" 而非 "required"
3. System Prompt 中没有告知可以使用工具
4. LLM 判断不需要工具：如果它认为自己知道答案，就不会调用

解决方案：
- 在 System Prompt 中明确："当用户问了需要实时数据的问题时，你必须调用工具"
- 将 tool_choice 设为 "required" 强制调用（测试用）
- 工具的 description 要写明什么场景下用
```

### Q13：tool_calls 解析错误

```python
# 安全解析工具调用
if response.choices[0].message.tool_calls:
    for tool_call in response.choices[0].message.tool_calls:
        try:
            args = json.loads(tool_call.function.arguments)
        except json.JSONDecodeError:
            print(f"JSON 解析失败: {tool_call.function.arguments}")
            continue
```

### Q14：Agent 死循环

```
可能原因：
- 工具调用返回结果后 LLM 反复调用同一个工具
- max_steps 没有设置，或设置过大
- 工具返回格式不对，LLM 无法理解

解决方案：
- 始终设置 max_steps（建议 5-10）
- 检测重复：如果连续 3 次调用同一工具且结果一样，主动停止
- 工具返回要清晰明了，用自然语言描述结果
```

---

## Streamlit / 前端

### Q15：Streamlit 页面不更新

```
解决方案：
- 页面右上角点 "Rerun"
- 在代码修改后保存，Streamlit 会自动检测并提示 rerun
- 清除缓存：st.cache_resource.clear() 或重启 Streamlit
```

### Q16：Streamlit 报 ModuleNotFoundError

```
确认：
- streamlit 是否安装在当前虚拟环境中
- 虚拟环境是否已激活
- 在正确目录运行：streamlit run 文件名.py
```

---

## Memory / 上下文

### Q17：对话历史导致 token 超限

```
解决方案：
- 设置 max_rounds 滑动窗口，只保留最近 N 轮
- 估算 token 用量：粗略 1 个中文字 ≈ 1.5 tokens
- 当 messages 接近上下文窗口时，对早期对话做总结压缩
- 使用 tiktoken 库精确计算 token 数
```

### Q18：加一忘了前面说过的话

```
可能原因：
1. 没有维护 messages 列表
2. 每次调用创建了新的 messages（丢失了历史）
3. 滑动窗口太小，把有用的信息也清掉了

确保：
messages.append({"role": "user", "content": user_input})
# ... LLM 调用
messages.append({"role": "assistant", "content": reply})
# 下一次调用时继续用同一个 messages
```

---

## 其他常见问题

### Q19：.env 文件不生效

```
- 确认 .env 文件在项目根目录（和你的 .py 文件在同一目录或上级目录）
- 确认没有命名为 .env.txt
- 调用顺序：先 load_dotenv()，再 os.getenv()
- 调试：print(os.getenv("OPENAI_API_KEY")) 看是否读取到
```

### Q20：代码在别人电脑上跑不通

```
最常见的遗漏：
- 没有提供 requirements.txt
- 没有说明需要 .env 文件
- 没有说明 Python 版本要求
- 硬编码了本地路径

项目交付 check list：
- [ ] requirements.txt 包含所有依赖
- [ ] README.md 有 setup 说明
- [ ] .env.example 提供环境变量模板
- [ ] 不用绝对路径
```

---

## 快速诊断流程

遇到问题时，按这个顺序排查：

```
1. 错误信息是什么？ → 复制到 Google / AI 搜索
2. 最近改了什么？ → Git diff 看变更
3. 环境对吗？ → python --version, pip list
4. 依赖版本对吗？ → 检查 requirements.txt
5. API 能通吗？ → 用 curl 或 Postman 测试
6. 打印中间变量 → 加 print() 看数据流
7. 缩小范围 → 写一个最小复现代码
```

> **最后的建议：** 80% 的问题都可以通过"把错误信息复制给 AI"来解决。学会提问，你就已经解决了一半的问题。

---

## 📚 参考资料

- [OpenAI API Error Codes](https://platform.openai.com/docs/guides/error-codes)
- [Streamlit Troubleshooting](https://docs.streamlit.io/knowledge-base)
- [FAISS Wiki](https://github.com/facebookresearch/faiss/wiki)
- [ChromaDB Troubleshooting](https://docs.trychroma.com/troubleshooting)
- [Stack Overflow - OpenAI Tag](https://stackoverflow.com/questions/tagged/openai-api)
- [HuggingFace Forums](https://discuss.huggingface.co/)
- [GitHub Issues - langchain](https://github.com/langchain-ai/langchain/issues)
