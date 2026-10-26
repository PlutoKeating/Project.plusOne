# 🐛 常见问题排查指南 Troubleshooting & FAQ

报错了先按现象查表，照"处理"一栏动手。

> **建议：** 表里找不到，就跳到页尾的"通用排查顺序"，一步步来。

---

## 环境搭建

| 现象 | 原因 | 处理 |
|------|------|------|
| 找不到 `python` | 安装时没加入系统路径 | 重装并勾选 "Add Python to PATH"，用 `python --version` 确认 |
| `pip install` 报 SSL 错误 | pip 太旧或网络拦了证书 | 先升级 pip，再把 pypi 域名设为信任主机 |
| 虚拟环境激活不了 | PowerShell 禁止脚本，或不在项目目录 | 执行策略改为 RemoteSigned，回到含 `venv` 的目录再激活 |

## API 调用

| 现象 | 原因 | 处理 |
|------|------|------|
| AuthenticationError | Key 不完整或 `.env` 没读到 | 核对 Key 无空格；`.env` 放项目根目录，先加载再建客户端 |
| RateLimitError | 余额用完或请求太密 | 查余额、调用间加间隔、换便宜模型 |
| 请求超时 | 网络不稳或模型慢 | 调长超时并开重试，国内可换代理或第三方地址 |
| 返回 404 | 地址或模型名写错 | 逐字核对 `.env` 地址和模型名 |

## RAG / 向量库

| 现象 | 原因 | 处理 |
|------|------|------|
| Windows 装不上 `faiss-cpu` | 缺编译环境 | 用 conda 装，或换 ChromaDB |
| 嵌入模型下载失败 | 国内访问 HuggingFace 受限 | 设镜像地址，或手动下载后按本地路径加载 |
| 检索结果不相关 | 切块不合适、嵌入模型不懂中文、Top-K 太小 | 先打印检索段落，再逐项调整对比 |
| 索引为空 | 漏了"存入"这步 | 确认"向量化 → 存入 → 检索"，打印条目数 |

## Agent / 工具调用

| 现象 | 原因 | 处理 |
|------|------|------|
| 模型不调工具 | 工具描述含糊，或提示词没说能用工具 | 描述里写清使用场景，提示词里列出必须用工具的情况 |
| 参数解析失败 | 模型给的参数不是合法 JSON | 捕获错误，把出错内容交回模型重来 |
| 循环停不下来 | 没设步数上限，或工具结果难懂 | 设 5–10 步上限；结果写成清楚的话；重复结果就停 |

## Streamlit 界面

| 现象 | 原因 | 处理 |
|------|------|------|
| 改了代码页面不变 | 没重新运行或命中缓存 | 点 Rerun，不行就清缓存或重启 |
| ModuleNotFoundError | 没装在当前虚拟环境 | 激活虚拟环境后装依赖，从项目目录启动 |

## 记忆 / 上下文

| 现象 | 原因 | 处理 |
|------|------|------|
| 聊久了 Token 超限 | 历史越积越长 | 只留最近 N 轮，或把早期对话压成摘要 |
| 加一忘了前文 | 每次新建了消息列表 | 全程复用同一份历史，每轮追加问和答 |

## 其他

| 现象 | 原因 | 处理 |
|------|------|------|
| `.env` 不生效 | 位置不对、存成 `.env.txt`、读取前没加载 | 查文件名和位置，先加载再读，打印变量确认 |
| 换台电脑跑不起来 | 缺依赖清单、缺 `.env` 说明、写死路径 | 补 `requirements.txt`、`.env.example`、README，去掉绝对路径 |

---

## 通用排查顺序

像查一道做坏的菜：从装盘往回，一道工序一道工序查。

```steps
icon: 📋
title: 读完整报错
desc: 复制给 AI 或搜索引擎

icon: 🔍
title: 看最近改了什么
desc: 用 `git diff` 对比

icon: 🐍
title: 确认 Python 版本和依赖

icon: 📡
title: 单独测 API 能否连通

icon: 🖨️
title: 打印中间变量
desc: 找出数据在哪一步出错

icon: 🔬
title: 写最小复现
desc: 删到只剩出错的几行
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
