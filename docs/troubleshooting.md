# 🐛 常见问题排查指南 Troubleshooting & FAQ

遇到报错先在下表里找现象，按"处理"一栏动手。

---

## 环境搭建

| 现象 | 原因 | 处理 |
|------|------|------|
| 命令行提示找不到 `python` | 安装时没把 Python 加入系统路径 | 重新安装并勾选 "Add Python to PATH"（Mac 可用 Homebrew 安装），再用 `python --version` 确认。 |
| `pip install` 报 SSL 证书错误 | pip 版本旧或网络拦截了证书校验 | 先升级 pip；仍失败就在安装时把 pypi 相关域名设为信任主机。 |
| 虚拟环境激活不了 | Windows PowerShell 默认禁止运行脚本，或不在项目目录 | 把当前用户的 PowerShell 执行策略改为 RemoteSigned，并回到含 `venv` 文件夹的目录再激活。 |

## API 调用

| 现象 | 原因 | 处理 |
|------|------|------|
| AuthenticationError（API Key 不正确） | Key 复制不完整、`.env` 没读到或位置不对 | 核对 Key 没有多余空格，确认 `.env` 在项目根目录且先加载 `.env` 再创建客户端。 |
| RateLimitError（超出额度） | 账户余额用完或请求太密 | 到服务商后台查余额并充值，调用之间加间隔，或换更便宜的模型。 |
| 请求超时 | 网络访问不稳定或模型响应慢 | 把超时时间调长并开启自动重试，国内网络可改用代理或第三方服务地址。 |
| 返回 404 | 服务地址写错或模型名拼错 | 逐字核对 `.env` 里的服务地址和代码里的模型名。 |

## RAG / 向量库

| 现象 | 原因 | 处理 |
|------|------|------|
| Windows 上 `faiss-cpu` 装不上 | 缺少编译环境 | 改用 conda 安装，或直接换成 ChromaDB。 |
| 嵌入模型下载失败 | 国内访问 HuggingFace 受限 | 设置 HuggingFace 镜像地址，或手动下载模型放到本地目录后按路径加载。 |
| 检索结果不相关 | 切块大小不合适、嵌入模型不适合中文、Top-K 太小 | 打印检索出的段落逐一检查，再依次调整切块大小、换中文嵌入模型、加大 Top-K 对比效果。 |
| 索引为空，什么都搜不到 | 检索前漏了"存入"这一步 | 确认流程是"向量化 → 存入 → 检索"，并打印索引里的条目数。 |

## Agent / 工具调用

| 现象 | 原因 | 处理 |
|------|------|------|
| 模型不调用工具，直接回答 | 工具描述太含糊、系统提示词没说可以用工具，或模型认为自己知道答案 | 在工具描述里写清使用场景，并在系统提示词里说明哪些问题必须调用工具。 |
| 工具参数解析失败 | 模型输出的参数不是合法 JSON | 解析时捕获错误，把出错内容返回给模型让它重新生成。 |
| Agent 一直循环停不下来 | 没设最大步数，或工具返回内容模型看不懂 | 设置 5–10 步上限，并把工具结果写成清楚的自然语言；同一工具连续多次返回相同结果就主动停止。 |

## Streamlit 界面

| 现象 | 原因 | 处理 |
|------|------|------|
| 改了代码页面不变 | 页面没有重新运行或命中了缓存 | 点右上角 Rerun，仍不变就清缓存或重启 Streamlit。 |
| 报 ModuleNotFoundError | Streamlit 没装在当前虚拟环境 | 激活项目的虚拟环境后安装依赖，再从项目目录启动。 |

## 记忆 / 上下文

| 现象 | 原因 | 处理 |
|------|------|------|
| 对话久了报 Token 超限 | 对话历史越积越长，超过上下文窗口 | 只保留最近 N 轮，或把早期对话压缩成摘要。 |
| 加一忘了前面说过的话 | 每次调用都新建了消息列表，或窗口设得太小 | 全程复用同一个对话历史，每轮把用户消息和模型回答都追加进去。 |

## 其他

| 现象 | 原因 | 处理 |
|------|------|------|
| `.env` 不生效 | 文件位置不对、被存成了 `.env.txt`，或读取前没加载 | 检查文件名和位置，确保先加载 `.env` 再读取变量，并打印变量值确认。 |
| 代码在别人电脑上跑不起来 | 缺依赖清单、缺 `.env` 说明、写死了本地路径 | 交付前补齐 `requirements.txt`、`.env.example` 和 README 安装说明，并去掉绝对路径。 |

---

## 通用排查顺序

```text
1. 读完整报错信息，复制给 AI 或搜索引擎
2. 回看最近改了什么（git diff）
3. 确认 Python 版本和已装依赖
4. 单独测试 API 能否连通
5. 打印中间变量，看数据在哪一步出错
6. 写一个最小复现，缩小范围
```

---

## 📚 参考资料

- [OpenAI API Error Codes](https://platform.openai.com/docs/guides/error-codes)
- [Streamlit Troubleshooting](https://docs.streamlit.io/knowledge-base)
- [FAISS Wiki](https://github.com/facebookresearch/faiss/wiki)
- [ChromaDB Troubleshooting](https://docs.trychroma.com/troubleshooting)
- [Stack Overflow - OpenAI Tag](https://stackoverflow.com/questions/tagged/openai-api)
- [HuggingFace Forums](https://discuss.huggingface.co/)
- [GitHub Issues - langchain](https://github.com/langchain-ai/langchain/issues)

---

**← 上一章：[速查表 Cheatsheet](/cheatsheet.md)**  
**→ 下一章：[版权与责任控制](/liability.md)**
