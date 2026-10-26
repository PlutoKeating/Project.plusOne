# 🧱 第 1 章：打造加一的身体 — Python 快速起步

## 故事：加一需要一具"身体"

加一以后的大脑是 LLM（大语言模型，能读写文字的 AI）。可现在她连手指都动不了。她需要一具能接指令、能办事的身体，这具身体就是 Python。

---

## 起步要会的 Python 概念

不用学透再开工，下面 9 个够用，其余遇到再学。

```cards
icon: 🏷️
title: 变量
what: 给一份数据贴个名字
like: 像贴了标签的调料罐，按名字取
use: `模型名 = "gpt-4o"`，用时喊名字

icon: 💬
title: 字符串
what: 一段文字
like: 像小票上写的一行字
use: 用户的话、发给模型的 **Prompt**

icon: 📦
title: 列表 list
what: 按顺序排好的一串数据
like: 像订单夹：一沓订单按先后夹好
use: 保存加一和用户的**对话历史**

icon: 📒
title: 字典 dict
what: "名字 → 内容"的对照表
like: 像菜单：查菜名，得到价格
use: 一条消息 `{角色: 用户, 内容: 你好}`

icon: ⚙️
title: 函数
what: 打包好的一套动作，喊名字就执行
like: 像标准作业卡：照着做就出一道菜
use: `调用模型(历史)`；每个工具都是函数

icon: 🔁
title: 循环与条件
what: 重复做，看情况走不同的路
like: 逐张处理订单夹，"要辣""不要辣"分开做
use: 对话循环；用户说"退出"就停

icon: 🧯
title: try / except
what: 出错时接住，程序不崩
like: 像后厨应急预案：一个灶坏了换灶接着做
use: 网络超时，回一句"请重试"

icon: 🧾
title: JSON
what: 长得像字典的文本格式
like: 像统一格式的订单小票
use: 和 **LLM API** 收发数据都用它

icon: 🧪
title: 虚拟环境
what: 每个项目一套独立的 Python
like: 像每家分店一套独立厨具，互不借用
use: 加一的项目库版本不和别的项目打架
```

---

## 这些概念怎么拼成一个对话助手

<div data-anim="ch01-chat-loop"></div>

*字符串进列表，列表交给函数，回复存回列表，再打印出来。*

本章先让它跑起来。"调用模型"暂时用一个复述用户原话的函数代替。

### 出错了怎么办

调用模型要走网络，可能出错。`try / except` 就像后厨应急预案：一个灶坏了换灶接着做，厨房不停摆。

<div data-anim="ch01-try-except"></div>

*没加保护时程序直接停；加了 try，错误被接住，程序接着跑。*

---

## 🐍 环境准备步骤

```steps
title: 安装 Python
desc: 3.10 或更高版本

title: 建项目文件夹和虚拟环境
desc: 像每家分店一套独立厨具

title: 激活虚拟环境
desc: 终端前面出现 `(venv)` 就成功了

title: 用 pip 装库
desc: pip 是 Python 的装包工具

title: 写 .py 文件并运行
desc: 在终端里运行，看到输出就成功
```

> **建议：** 不同系统命令略有差别，直接问 AI："在 Windows / macOS 上怎么创建并激活 Python 虚拟环境？"

> **加一的第一个产出：** 一个能在终端里来回对话的模拟助手。它现在只会复述你的话，但程序已经跑起来了。

---

## 🤖 向 AI 提问

> **概念不懂：** "请用生活类比解释 Python 中的字典（dict）是什么？我刚开始学编程。"

**Prompt 模板：**

```
角色：你是一个擅长类比教学的编程导师
任务：用不超过 200 字解释 [概念名称]
受众：零编程基础的成人学习者
要求：使用一个生活场景的比喻，不要直接抄定义
```

---

## 检查清单

- [ ] 能说出上面每张卡片的概念在 Agent 项目里干什么
- [ ] 创建并激活过一个虚拟环境
- [ ] 跑通了终端里的模拟对话助手

> **加一说：** "身体搭好了，下一步让我睁开眼睛，看看这个世界吧！"

---

## 📚 本章参考资料

- [Python 官方教程](https://docs.python.org/3/tutorial/) — 最权威的 Python 入门指南
- [Real Python](https://realpython.com/) — 高质量 Python 教程，从基础到高级
- [W3Schools Python Tutorial](https://www.w3schools.com/python/) — 零基础友好的交互式学习平台
- [LearnPython.org](https://www.learnpython.org/) — 免费在线交互式教程，浏览器里即学即练

---

**← 上一章：[序章：加一的诞生](/README.md)**  
**→ 下一章：[第 2 章：加一睁开双眼 — 第一次 LLM API 调用](/ch02/)**
