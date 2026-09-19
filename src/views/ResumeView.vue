<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import PageControls from '@/src/components/PageControls.vue';
import { isLocale, profiles, ui, type Locale } from '@/lib/site';

const route = useRoute();
const locale = computed<Locale>(() => isLocale(String(route.params.locale)) ? String(route.params.locale) as Locale : 'zh');
const profile = computed(() => profiles[locale.value]);
const t = computed(() => ui[locale.value]);
const portraitSrc = '/profile-portrait-cutout.png';
const resumeName = computed(() => locale.value === 'zh' ? '王锐其' : profile.value.name);
const resumeRole = computed(() => locale.value === 'zh' ? '时代在发展' : profile.value.role);
const resumeLocation = computed(() => locale.value === 'zh' ? '我也在进步' : profile.value.location);
const resumeBio = computed(() => locale.value === 'zh' ? '把问题解决、把选择做正确、把结果尽可能做到完美！' : profile.value.bio);
const resumeSkills = computed(() => locale.value === 'zh'
  ? ['RAG系统搭建', 'Agent编排', '数据处理', 'LangChain框架', 'Transformers框架']
  : profile.value.skills);
const workItems = computed(() => locale.value === 'zh'
  ? [{ period: '2023-2026', role: 'AI大模型开发工程师', company: '杭州易有料科技有限公司', summary: '负责RAG与Agent开发与调优，并实现从问题定义走向稳定交付。' }]
  : profile.value.experience);
const projectItems = [
  {
    label: '项目一',
    title: '智营销',
    details: [
      { label: '项目背景', content: '智营销是针对阳光保险公司内部业务资料分散、查询效率低、新人上手慢、业务咨询成本高的问题，搭建面向销售、售前、客户支持部门的企业级 RAG 智能问答知识库系统。' },
      { label: '主要工作', content: '• 负责 RAG 主链路设计与实现，拆分请求上下文、路由、检索、上下文、Prompt、生成、历史写入等阶段。\n• 设计并实现 QAService / Pipeline 编排层，统一管理意图识别、检索策略、查询改写、FAQ / Doc 检索、上下文构建和流式生成。\n• 接入规则候选、本地 BERT 分类器和 Decision Gateway，按置信度保守路由、知识查询、追问和边界，并保留知识查询兜底。\n• 使用 Milvus 2.5 搭建 Dense + BM25 Hybrid Search 检索链路，支持多变体检索、合并去重和 Encoder 重排。\n• 实现 WebSocket 流式输出，按事件返回答案、引用来源、诊断信息和耗时指标。' },
      { label: '项目成果', content: '• 接入约 3,000 份企业资料、整理 800 条标准 FAQ，为约 200 名员工提供统一知识检索与问答服务。\n• 文档问题 Recall@10 由 83% 提升至 94%，MRR 由 0.72 提升至 0.86，答案通过率由 78% 提升至 91%。\n• 员工平均资料查找与核对时间由约 5 分钟缩短至 1.5 分钟，效率提升约 70%。\n• FAQ 平均响应时间约 0.8 秒，文档问答平均首字响应时间约 2.5 秒，完整响应时间约 8 秒。' },
    ],
  },
  {
    label: '项目二',
    title: '智能财税',
    details: [
      { label: '项目背景', content: '智能财税是一款为杭州启明财务管理有限公司设计并开发的 AI 财税 Agent 系统。该系统采用 MCP + A2A 三层架构，解决发票识别错误率高、税收政策响应滞后、多系统切换效率低等问题。' },
      { label: '主要工作', content: '1. 主导设计财税 MCP Server 架构：定义 MCP 协议规范，推动 13 个异构系统（税务计算引擎、发票识别系统、财务报表系统等 10 个外部接口 + 3 个内部工具）的统一对接，实现大模型通过自然语言调用发票识别、报税计算、财务报表等工具。\n2. 设计 A2A 多代理协作框架：制定三个子代理（InvoiceAgent / TaxAgent / AnalysisAgent）的通信协议和任务分配机制，实现发票识别→验真→入账→报税→风控的端到端自动化，9 类意图自动路由。\n3. 推动季度末申报高峰性能优化方案：针对发票识别瓶颈（QPS 100 → 500），设计 Redis 缓存 + 异步并发 + SQL 优化的组合方案，API 响应 < 300ms，扛住季度末 3–5 倍业务压力。\n4. 主导企业级数据权限架构设计：实现 enterprise_id + accountant_id 双重隔离机制，四张核心表（企业档案、发票记录、报税记录、财务报表）全部严格隔离，确保财税数据安全合规。\n5. 深度参与需求分析：调研 5,000+ 会计实际需求，对齐 9 类核心财税场景，输出 25+ 页系统文档（含架构图、税务合规方案、数据权限设计），推动税务合规方案和数据权限设计的评审。\n6. 规划并推动工程化落地：编写完整系统文档与 Prompt 模板，新人上手周期从 2 周缩短至 3 天；推动 Docker 容器化部署和 10 个外部系统对接联调，发票数据本地化存储。\n7. 优化 Prompt 工程：设计财税领域 Prompt 模板，加入 Few-shot 示例和思维链（CoT），提升复杂税务筹划建议的质量。\n8. 搭建 Agent 评估体系：基于 LangSmith 通过 Bad Case 分析持续优化 MCP 工具调用成功率，从 96% 提升至 98.5%。' },
      { label: '项目成果', content: '• 交付 13 个 MCP 工具，覆盖发票、报税、分析、风控全场景。\n• 意图识别准确率 93%+，9 类财税意图自动路由。\n• 发票识别准确率 99%+，录入效率提升 85%，MCP 工具调用成功率 98.5%。\n• 报税效率提升 70%，税务风险降低 80%，银行对账时间由 90 分钟缩短至 5 分钟。' },
    ],
  },
  {
    label: '项目三',
    title: '简梳司',
    details: [
      { label: '项目背景', content: '简梳司是为杭州久诚电子有限公司 HR 部门打造的简历智能初筛平台，覆盖岗位管理、简历批处理、候选人匹配评分和人工复核，提升筛选效率与评估规范性，为招聘决策提供数据支持。' },
      { label: '主要工作', content: '• 负责后端服务、AI 推理模块、数据库设计、JWT 鉴权、RBAC 权限控制及核心 API 开发。\n• 负责 PDF、Word、TXT 简历批量解析与预处理，实现文本提取、段落切分、联系方式识别及技能、项目经历抽取。\n• 基于 TinyBERT 构建简历段落过滤模型，基于 MacBERT 多头回归模型实现技能、经验、项目、基础四维评分及综合匹配度计算。\n• 通过模型单例加载、岗位向量缓存、批量推理和异步任务优化性能，并结合规则兜底、硬性条件校验和模型降级保障系统稳定性。' },
      { label: '项目成果', content: '• 基于 10,000+ 份简历验证，批处理吞吐量提升约 3 倍，平均处理耗时降低约 60%。\n• 通过多阶段模型架构，将无关段落过滤率提升至约 70%；内部测试集四维评分平均准确率约 85%，Top 10 候选人命中率约 80%。\n• 通过岗位向量缓存、模型单例加载和分批推理，模型服务内存占用降低约 35%。\n• 引入规则兜底、硬性条件校验和模型降级机制，将系统稳定性与异常场景服务处理能力从 42% 提升至 93%。' },
    ],
  },
];
</script>

<template>
  <main id="main-content" class="content-shell page-main resume-page" :class="{ 'resume-page-zh': locale === 'zh' }">
    <PageControls :home-href="`/${locale}`" />
    <header class="page-intro resume-intro">
      <p class="eyebrow">{{ t.resume }} · CV</p><h1>{{ t.resumeTitle }}</h1>
      <div><p>{{ resumeBio }}</p><span v-if="locale !== 'zh'" class="placeholder-badge">{{ t.placeholder }}</span></div>
    </header>
    <div class="resume-layout">
      <aside class="resume-sidebar">
        <div class="resume-identity">
          <div class="resume-monogram" :aria-label="locale === 'zh' ? '王锐其职业头像' : 'Portrait placeholder'">
            <img v-if="locale === 'zh'" :src="portraitSrc" alt="王锐其职业头像" />
            <span v-else>{{ profile.initials }}</span>
          </div>
          <div class="resume-identity-copy"><p class="resume-name">{{ resumeName }}</p><p>{{ resumeRole }}</p><p>{{ resumeLocation }}</p></div>
        </div>
        <section><h2>{{ t.capabilities }}</h2><ul class="skill-list"><li v-for="skill in resumeSkills" :key="skill">{{ skill }}</li></ul></section>
      </aside>
      <div class="resume-sections">
        <section class="resume-section">
          <h2>{{ t.workExperience }}</h2>
          <article v-for="item in workItems" :key="`${item.period}-${item.role}`" class="timeline-item">
            <p class="timeline-period">{{ item.period }}</p><div><h3>{{ item.role }}</h3><p class="timeline-company">{{ item.company }}</p><p>{{ item.summary }}</p></div>
          </article>
        </section>
        <section class="resume-section">
          <h2>{{ locale === 'zh' ? '项目经验' : t.achievements }}</h2>
          <div v-if="locale === 'zh'" class="project-accordion">
            <details v-for="project in projectItems" :key="project.label" class="project-panel">
              <summary>
                <span class="project-label">{{ project.label }}</span>
                <span class="project-title">{{ project.title }}</span>
                <span class="project-toggle" aria-hidden="true">＋</span>
              </summary>
              <div class="project-detail-grid">
                <article v-for="detail in project.details" :key="detail.label" class="project-detail-box">
                  <h3>{{ detail.label }}</h3>
                  <p>{{ detail.content }}</p>
                </article>
              </div>
            </details>
          </div>
          <ol v-else class="outcome-list"><li v-for="(item, index) in profile.achievements" :key="item"><span>{{ String(index + 1).padStart(2, '0') }}</span>{{ item }}</li></ol>
        </section>
        <section v-if="locale !== 'zh'" class="resume-section"><h2>{{ t.education }}</h2><article v-for="item in profile.education" :key="item.period" class="timeline-item"><p class="timeline-period">{{ item.period }}</p><div><h3>{{ item.degree }}</h3><p class="timeline-company">{{ item.school }}</p></div></article></section>
      </div>
    </div>
  </main>
</template>
