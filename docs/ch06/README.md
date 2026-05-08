# 👥 第 6 章：加一的团队 — Multi-Agent 何时用

## 故事：一个人忙不过来了

加一现在功能很强大了：她能说话、能查资料、能调用工具、还有记忆。但有一天，她遇到了一个复杂的任务：

> **用户：** "帮我调研一下竞争对手的最新产品动态，整理成一份报告，然后发邮件给团队所有人。"

加一需要：
1. 搜索互联网（搜索引擎）
2. 阅读并总结多篇文章（阅读 + 总结能力）
3. 写一份结构化报告（写作能力）
4. 查询团队邮箱列表（数据库查询）
5. 发送邮件（邮件工具）

虽然加一一个人可以做所有事，但：

- **步骤太多了**，一个地方出错整个流程就断了
- **工具来回切换**，上下文越来越乱
- **没有一个"项目经理"角色**来协调各个步骤

老张的解决方案是：**给加一组建一个团队。**

这就是 **Multi-Agent（多智能体系统）**——多个 AI Agent 协同工作，各司其职。

---

## 多 Agent 的核心思想

```
                       Orchestrator（协调者）
                      /         |          \
                     ▼          ▼           ▼
               Researcher    Writer     Email Agent
              (调研 Agent)   (写作 Agent)  (发邮件 Agent)
                     \          |           /
                      ▼         ▼          ▼
                       Final Result
```

**核心原则：每个 Agent 只做一件事，且做好。**

---

## 什么时候需要多 Agent？

| 场景 | 单 Agent 够吗？ | 多 Agent ? |
|------|----------------|------------|
| 简单的问答对话 | ✅ 足够 | 不需要 |
| 单工具的调用（查天气） | ✅ 足够 | 不需要 |
| 多步骤但有明确流程 | ✅ 可以，但需要复杂 Prompt | 用了更清晰 |
| 需要不同角色/专业知识 | ❌ 不太好 | ✅ 推荐 |
| 复杂的协作流程 | ❌ 很难维护 | ✅ 强烈推荐 |

### 一个决策框架

```
你的任务需要多个不同的"角色"吗？
    ↓
需要不同的专业知识吗？
（比如：一个负责搜索，一个负责编程，一个负责审核）
    ↓
需要并行处理多个子任务吗？
（比如：同时查天气、查新闻、查股票）
    ↓
单个 Agent 的上下文是否经常被冲乱？
    ↓
以上有一项是 → 考虑用多 Agent
以上全是"否" → 单 Agent 就够
```

---

## 最常见的多 Agent 模式

### 模式 1：Orchestrator-Worker（协调者-工作者模式）

```
Orchestrator Agent → 接收用户需求，分解任务，分派给 Worker
Worker Agent 1    → 执行子任务 A
Worker Agent 2    → 执行子任务 B
Orchestrator      → 汇总结果，输出最终答案
```

**适用场景：** 需要将复杂任务拆分为多个独立子任务的场景。

### 模式 2：Pipeline（流水线模式）

```
Agent A (输入处理) → Agent B (分析) → Agent C (输出格式化)
```

**适用场景：** 步骤之间有严格先后顺序的场景。

### 模式 3：Debate（辩论模式）

```
Agent A: "我认为答案是 X"
Agent B: "我认为答案是 Y"
评判 Agent: "综合考虑，最佳答案是 X"
```

**适用场景：** 需要多角度评估、提高结果准确性的场景（如代码审查、内容审核）。

---

## 最小代码：双 Agent 协作 Demo

创建一个搜索 + 总结的双 Agent 系统：

```python
from openai import OpenAI
from dotenv import load_dotenv
import os
import json

load_dotenv()
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL"),
)

# ─── Agent 1: 搜索研究员 ───
def search_agent(topic: str) -> str:
    """搜索 Agent：模拟搜索并返回原始信息"""
    # 真实场景中这里会调用搜索 API
    # 这里模拟搜索结果
    mock_results = {
        "AI Agent 最新进展": """
        1. OpenAI 发布了 GPT-4.1，增强了工具调用能力
        2. Anthropic 推出了 MCP 协议，标准化 AI 工具接入
        3. Google 发布了 Gemini 2.5，支持超长上下文
        4. 多家创业公司推出了 Agent 开发平台
        """,
        "RAG 技术趋势": """
        1. Graph RAG 结合知识图谱提升检索质量
        2. 多模态 RAG 支持图片、表格检索
        3. Agentic RAG 让 Agent 自主决定检索策略
        """,
    }
    
    # 简单匹配
    for key, value in mock_results.items():
        if any(word in topic for word in key.split()):
            return value
    
    return f"未找到关于「{topic}」的搜索结果，建议扩大搜索范围。"

# ─── Agent 2: 报告撰写员 ───
def writer_agent(raw_info: str, requirement: str) -> str:
    """写作 Agent：基于原始信息生成结构化报告"""
    prompt = f"""你是一个专业的科技报告撰写员。
请基于以下原始信息，写一份结构化报告。

原始信息：
{raw_info}

要求：
{requirement}

报告格式要求：
1. 使用标题和子标题
2. 每条信息用要点列出
3. 每个要点附上简要分析
4. 最后给出总结与建议
"""
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "你是一个专业的技术报告撰写员，善于将零散信息整理成结构化报告。"},
            {"role": "user", "content": prompt},
        ],
        temperature=0.5,
    )
    return response.choices[0].message.content

# ─── Agent 3: 质量控制员（可选）───
def qc_agent(report: str) -> str:
    """质量检查 Agent：审查报告质量"""
    prompt = f"""请审查以下报告的质量，给出评分（1-5分）和改进建议：

报告：
{report}

审查维度：
1. 结构完整性
2. 信息准确性
3. 可读性
4. 是否有实质性内容
"""
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "你是一个严格的质量检查员。"},
            {"role": "user", "content": prompt},
        ],
        temperature=0.3,
    )
    return response.choices[0].message.content

# ─── 协调者 ───
def orchestrator(topic: str, requirement: str = "简洁易懂的格式"):
    """协调者：编排整个工作流"""
    print(f"\n📋 任务: 调研「{topic}」\n")
    
    print("🔍 Agent 1 (研究员): 正在搜索...")
    raw_info = search_agent(topic)
    print(f"   找到信息:\n{raw_info}\n")
    
    print("✍️  Agent 2 (撰写员): 正在撰写报告...")
    report = writer_agent(raw_info, requirement)
    print(f"   报告完成:\n{report}\n")
    
    print("✅ Agent 3 (质检员): 正在审查...")
    qc_result = qc_agent(report)
    print(f"   审查结果:\n{qc_result}\n")
    
    print("📊 最终交付:")
    print("=" * 50)
    print(report)
    print("=" * 50)
    
    return report

# 测试
orchestrator("AI Agent 最新进展", "面向技术管理者的简要报告")
```

---

## 多 Agent 的陷阱

### 陷阱 1：过度设计

```
❌ 用户问"几点了" → 启动 5 个 Agent 协作
✅ 用户问"几点了" → 直接调用时间工具
```

> **原则：能用单 Agent 解决的，绝不用多 Agent。**

### 陷阱 2：Agent 之间互相干扰

多个 Agent 共享同一个上下文时，A 的中间结果可能污染 B 的推理。

> **对策：每个 Agent 使用独立的对话上下文。**

### 陷阱 3：错误传播

```
Agent A 出错 → Agent B 基于错误继续 → 最终结果完全偏离
```

> **对策：每个步骤做输入输出校验，关键节点加入人工审核。**

### 陷阱 4：成本爆炸

多 Agent = 多 LLM 调用 = 更多 Token 消耗。

> **对策：评估每个 Agent 增加的 Token 成本是否值得。**

---

## 新手应该怎么做？

**先不要碰多 Agent。**

> **💡 Anthropic 的研究发现：** 许多成功的 Agent 部署实际上使用的是简单的单 Agent 架构。复杂性应该只在被实际失败证明必要时才添加——而不是一开始就设计进去。如果你的单 Agent 系统已经能稳定完成 80% 以上的任务，在引入多 Agent 之前先问自己：当前系统的真实瓶颈是什么？多 Agent 是否是最简解法？

一条明确的建议：

```diff
- 不要一开始就学 Multi-Agent
+ 先把单 Agent 做通

- 不要觉得多个 Agent 就更高端
+ 单 Agent 能解决 80% 的问题

- 不要在生产环境第一个版本就用多 Agent
+ 先从单 Agent 起步，遇到瓶颈再拆分
```

### 你的正确顺序

1. ✅ 单 Agent + 简单工具
2. ✅ 单 Agent + 复杂工具 + 好的 Memory
3. ✅ 单 Agent 稳定运行
4. ⬜ 考虑是否真的需要多 Agent
5. ⬜ 从 Orchestrator-Worker 模式开始尝试多 Agent

---

## 🤖 向 AI 提问

### 判断是否需要多 Agent

> **向 AI 提问：** "我的场景是 [描述你的场景]。请帮我分析这个场景是否需要用多 Agent，还是单 Agent 就够了？给出理由。"

### 设计多 Agent 架构

> **向 AI 提问：** "请为我设计一个多 Agent 系统，用于 [场景]。需要哪些 Agent？各自负责什么？如何协作？给出架构图和代码示例。"

### 最佳 Prompt 模板

```
角色：你是一个多 Agent 系统架构师
任务：评审我的多 Agent 设计方案
我的方案：[描述你的设计]
评审维度：
1. 每个 Agent 的职责边界是否清晰
2. 是否过度设计（能用单 Agent 解决吗？）
3. 错误传播风险
4. Token 成本评估
```

---

## 检查清单

完成本章后，你应该能：

- [ ] 判断什么场景需要多 Agent，什么场景不需要
- [ ] 理解 Orchestrator-Worker、Pipeline、Debate 三种模式
- [ ] 能实现一个简单的双 Agent 协作 Demo
- [ ] 理解多 Agent 的主要陷阱和避免方法
- [ ] 知道从单 Agent 到多 Agent 的正确演进路径

> **加一说：** "学会了团队协作，我感觉自己已经长大了很多。从最开始只会复读，到现在能带团队完成复杂任务。但我发现，学再多概念也不如实实在在做几个项目——是时候用真正的项目来检验我的能力了！"

---

---

## 📚 参考资料

- https://www.anthropic.com/engineering/building-effective-agents — Anthropic 的 Agent 构建指南，重点阐述何时不应使用多 Agent 架构
- https://docs.crewai.com/ — CrewAI，专为多 Agent 协作设计的框架
- https://microsoft.github.io/autogen/ — 微软 AutoGen，多 Agent 对话框架
- https://langchain-ai.github.io/langgraph/tutorials/multi_agent/ — LangGraph 多 Agent 教程
- https://arxiv.org/abs/2308.08155 — AutoGen 论文：Enabling Next-Gen LLM Applications via Multi-Agent Conversation

---

**← 上一章：[第 5 章：加一的工具箱与记忆库 — Tool, MCP, Memory](/ch05/)**  
**→ 下一章：[第 7 章：加一毕业了 — 项目实战清单 & 面试准备](/ch07/)**
