---
locale: zh
translationKey: ambiguity-to-action
title: LangChain 生态系统
excerpt: 从在线问答与离线入库两条主线，理解 LangChain 在企业级 RAG 系统中的工程角色与接口边界。
publishedAt: 2026-08-12
updatedAt: 2026-08-30
order: 3
category: learning
tags: [coreRag]
draft: false
readingMinutes: 12
---
## 第一部分：LangChain 在系统中的角色

### LangChain 不是完整业务流程

LangChain 不是模型，也不是知识库，更不是系统的业务大脑。它更像一组标准接口：

| 系统问题                  | LangChain 提供的抽象                                     |
| :------------------------ | :------------------------------------------------------- |
| 不同 LLM 厂商 API 不一致  | `ChatOpenAI` 等的ChatModel 会统一接口                    |
| 多轮对话消息结构容易混乱  | `SystemMessage` / `HumanMessage` / `AIMessage`会统一结构 |
| LLM 输出格式不稳定        | `with_structured_output()` + Pydantic统一数据格式        |
| 历史消息要持久化          | `SQLChatMessageHistory`会满足要求                        |
| 文件格式不同              | Document Loader会统一文件格式                            |
| 大文档需要切块            | Text Splitter会统一切块方式                              |
| 向量库写入和检索 API 复杂 | VectorStore会解决该问题                                  |

也就是说，LangChain 解决的是**接口标准化**和**工程胶水**问题。具体怎么解决业务流程仍然由 `qa_core` 自己编排。

## 第二部分：一张图看清两条主线

系统中 LangChain 的使用分成两条线：

1. **在线问答链路**：用户提问 -> 意图识别 -> 检索准备 -> Prompt -> LLM 流式生成。
2. **离线入库链路**：业务文件 -> Document -> 切分 -> Milvus VectorStore 写入。

![LangChain 在线问答与离线入库两条主线示意图](/article-images/langchain-ecosystem-overview.png)


## 第三部分：在线问答链路中的 LangChain

下面说明用户提问后 LangChain 参与在线回答的位置、代码落点与组件作用。

### 3.1 ChatOpenAI：统一模型调用入口

在这里我喜欢使用的是DashScope 的 OpenAI-compatible 接口，但代码里不直接写 DashScope SDK，而是统一用 LangChain 的 `ChatOpenAI`：**from langchain_openai import ChatOpenAI**

### 3.2 Message：让多轮对话结构稳定

LangChain 的消息对象对应 OpenAI API 的角色格式：

| LangChain 对象  | API role    | 系统用途                           |
| :-------------- | :---------- | :--------------------------------- |
| `SystemMessage` | `system`    | 设定助手身份、回答边界、风险约束   |
| `HumanMessage`  | `user`      | 用户问题、改写请求、检索上下文问题 |
| `AIMessage`     | `assistant` | 历史回答，进入多轮上下文           |

需要理解：LLM 本身没有会话记忆。所谓“多轮对话”，本质是每次调用模型时，把必要的历史消息重新发给模型。这里给一个图便于理解：

![LangChain 多轮对话历史消息组装示意图](/article-images/langchain-message-history.png)

### 3.2.1 History 不等于模型自带记忆

LangChain 中常说的 Memory，不能理解成“模型自己记住了用户”。它的真实过程是：

本轮请求  -> 从存储读取 session_id 对应的历史消息  -> 组装SystemMessage/HumanMessage/AIMessage  -> 再次发送给模型

> `session_id`: 是会话隔离边界，`message` 保存 LangChain 序列化后的消息内容。相同用户开启不同会话时，只要 `session_id` 不同，读取到的历史就不会混在一起。

`SQLChatMessageHistory` 负责把 LangChain 消息对象映射到关系型数据库。它解决的是消息的读写适配，不负责判断哪些历史与当前问题相关，也不负责检索知识库。

### 3.3 Structured Output：把 LLM 输出变成业务对象

查询变体生成不能让模型自由发挥。自由文本会出现格式都不稳定的情况，我一般使用Pydantic 结构约束输出的格式。

这一步是 LangChain 在系统中非常关键的价值：**让 LLM 的输出进入可校验、可分支、可记录的工程世界**。

### 3.4 Prompt Profile：不是一个 Prompt 走天下

不能把所有问题都塞进同一个 Prompt，而是按意图和风险类别选择不同模板，比如：

```python
PROMPT_PROFILES = {
    "FAQ_QUERY": PromptProfile(
        name="faq_answer",
        system_template=FAQ_ANSWER_SYSTEM_PROMPT,
        user_template=FAQ_ANSWER_USER_TEMPLATE,
        reason="FAQ 类问题优先复用标准答案，控制回答长度和业务口径。",
    ),
    "KNOWLEDGE_QUERY": PromptProfile(
        name="knowledge_answer",
        system_template=KNOWLEDGE_ANSWER_SYSTEM_PROMPT,
        user_template=KNOWLEDGE_ANSWER_USER_TEMPLATE,
        reason="业务知识咨询需要整合文档资料。",
    ),
    "FOLLOW_UP": PromptProfile(
        name="follow_up",
        system_template=FOLLOW_UP_ANSWER_SYSTEM_PROMPT,
        user_template=FOLLOW_UP_ANSWER_USER_TEMPLATE,
        reason="追问需要结合历史理解指代。",
    ),
}
```

可以这样理解：

- Prompt 不是一段固定文案，而是**回答策略配置**。
- `system_template` 控制助手身份、边界、风险口径。
- `user_template` 注入历史、检索上下文、用户问题。
- `reason` 进入调试信息，帮助解释为什么选择这个模板

### 3.5 最终答案：ChatOpenAI.stream() 推给前端

注意：这里不是 LangChain 替我们完成整个 RAG。LangChain 只负责模型流式调用；FAQ 直出、文档检索、上下文筛选、引用补强、写历史这些仍由示例代码控制。

## 第四部分：离线入库链路中的 LangChain

![LangChain 离线入库链路示意图](/article-images/langchain-offline-ingestion.png)

### 4.1 Document：统一数据结构

Document：知识库统一数据结构；用于承载检索召回得到的文本片段以及对应的来源元数据，作为 qa‑core 内部各模块之间传递检索结果的标准载体。

### 4.2 Loader、Splitter 与 VectorStore 的接口边界

| 组件            | 输入                            | 输出                    | 作用               |
| :-------------- | :------------------------------ | :---------------------- | :----------------- |
| Document Loader | PDF、Word、Markdown、表格等文件 | `list[Document]`        | 加载文档           |
| Text Splitter   | `list[Document]`                | 更小的 `list[Document]` | 文本切块——父子切块 |
| VectorStore     | `Document` 与查询文本           | 写入结果或检索候选      | 写入向量库         |

组件的价值是统一接口：上游文件格式可以不同，但进入切分前统一为 `Document`；切分策略可以变化，但写入 VectorStore 的对象仍然是 `Document`。LangChain 负责这些生态接口，示例代码负责版本、权限、质量门禁和业务编排

## 第五部分：Runnable 和 LCEL 只作为统一接口理解

### 5.1 Runnable 的意义

Runnable 是 LangChain 的统一调用协议。无论 Prompt、Model、Parser，核心调用都收敛到三个方法：

| 方法       | 语义                   | 示例实现对应                       |
| :--------- | :--------------------- | :------------------------------- |
| `invoke()` | 一个输入，返回完整结果 | 查询改写、查询变体结构化输出     |
| `stream()` | 一个输入，持续返回片段 | 最终答案逐 token 输出            |
| `batch()`  | 多个输入，批量处理     | 批量测试、批量解析、离线评测可用 |

### 5.2 LCEL 是线性链路语法，不是系统主流程

LCEL 可以把 Prompt、Model、Parser 串成线性管道

它适合简单线性任务：

输入变量 -> Prompt -> Model -> Parser -> 输出

可以这样总结：

> LCEL 很适合教“组件怎么串起来”，但企业 RAG 主链路有大量分支、阈值、提前退出和诊断信息，所以企业级系统不用一条 LCEL 链包到底。

## 第六部分：自研与生态的分工

### 6.1 交给 LangChain 的部分[¶](#61-langchain)

| 能力                  | 原因                              |
| :-------------------- | :-------------------------------- |
| LLM 客户端            | 多厂商 OpenAI-compatible 统一接口 |
| Message 类型          | 对话历史结构稳定                  |
| 结构化输出            | Pydantic 约束，减少自由文本解析   |
| SQLChatMessageHistory | 省掉历史消息 CRUD                 |
| Document / Loader     | 文件解析后统一结构                |
| Text Splitter         | 成熟切分策略，减少手写边界问题    |
| VectorStore           | 统一向量库写入和检索入口          |

### 6.2 系统自己实现的部分

| 能力           | 为什么自己做                                                 |
| :------------- | :----------------------------------------------------------- |
| 查询路由       | 要优先处理问候、转人工、越界、FAQ 精确命中                   |
| 意图决策网关   | 高频确定场景由规则处理，检索类长尾由 BERT 模型增强，避免所有请求都调用 LLM |
| 检索计划       | 不同意图、风险类别、source 需要不同参数                      |
| FAQ 直出       | 标准答案命中后不需要 LLM 生成                                |
| 上下文筛选     | 要做分数阈值、重排、来源整理                                 |
| Prompt Profile | 不同业务类别要有不同口径                                     |
| 引用补强       | 企业 RAG 必须给出可追溯来源                                  |
| Trace 和诊断   | 调试、验收和生产排障都需要可解释过程                         |

## 第七部分：常见误区

### 7.1 误区一：用了 LangChain 就应该用 RetrievalQA

不对。`RetrievalQA` 适合快速 demo，但企业级 RAG 需要：

- FAQ 标准答案直出
- 意图识别
- 追问改写
- 多场景 source 过滤
- 知识库版本隔离
- 风险 Prompt Profile
- 引用来源补强
- Trace 和诊断面板

这些都很难塞进一个黑盒 Chain 里。

### 7.2 误区二：LCEL 越多越工程化

LCEL 适合表达线性链路，但不是所有流程都应该写成管道。复杂业务分支用显式函数更清楚，也更容易调试。

几个例子来说明：LCEL 管道就是**流水线传送带，适合一条路走到黑**，如果多选择、多分叉的业务，就别硬塞传送带，改用普通函数条件判断（if-else），工程质量反而更高。

### 7.3 误区三：SemanticChunker 一定比 RecursiveCharacterTextSplitter 更好

不一定。企业 RAG 里的切分要可控、稳定、便宜、可复现。`RecursiveCharacterTextSplitter` 更适合作为默认方案；`SemanticChunker` 可以作为特殊文档的增强策略，而不是主链路默认切分器。

### 7.4 误区四：VectorStore 就是 Milvus

不是。VectorStore 是 LangChain 的抽象，Milvus 是具体后端。
