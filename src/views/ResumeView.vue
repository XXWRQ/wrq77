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
  ? [{ period: '2023-2026', role: 'AI应用开发工程师', company: '杭州海康威视数字技术股份有限公司', summary: '负责RAG与Agent开发与调优，并实现从问题定义走向稳定交付。' }]
  : profile.value.experience);
const projectItems = [
  {
    label: '项目一',
    title: '将复杂流程重构为更清晰的三步体验（示例）',
    details: [
      { label: '项目背景', content: '原有业务流程节点较多、信息分散，用户完成核心任务时需要在多个页面之间反复切换。' },
      { label: '主要工作', content: '梳理关键用户路径与业务约束，重新组织信息层级，并将核心流程收敛为三个连续步骤。' },
      { label: '项目成果', content: '降低了操作理解成本与流程中断率，让任务状态、下一步动作和最终结果更加清晰。' },
    ],
  },
  {
    label: '项目二',
    title: '建立跨团队共用的设计原则与组件规范（示例）',
    details: [
      { label: '项目背景', content: '多个团队并行迭代时存在界面表达不一致、组件重复建设和交付标准不统一的问题。' },
      { label: '主要工作', content: '盘点高频场景与现有组件，制定共用设计原则、组件规范和协作维护流程。' },
      { label: '项目成果', content: '提升了方案复用率与跨团队协作效率，并减少了设计到开发阶段的沟通与返工成本。' },
    ],
  },
  {
    label: '项目三',
    title: '持续记录方法、复盘与实践中的新问题（示例）',
    details: [
      { label: '项目背景', content: '实践经验分散在不同记录中，难以形成可检索、可复用并持续更新的个人知识体系。' },
      { label: '主要工作', content: '建立统一的记录模板和标签结构，定期复盘项目过程，并沉淀可再次使用的方法与判断依据。' },
      { label: '项目成果', content: '缩短了从记录到再次使用的距离，让经验能够支持后续分析、表达和问题解决。' },
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
