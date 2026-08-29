<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import PageControls from '@/src/components/PageControls.vue';
import { isLocale, profiles, ui, type Locale } from '@/lib/site';

const route = useRoute();
const locale = computed<Locale>(() => isLocale(String(route.params.locale)) ? String(route.params.locale) as Locale : 'zh');
const profile = computed(() => profiles[locale.value]);
const t = computed(() => ui[locale.value]);
</script>

<template>
  <main id="main-content" class="content-shell page-main resume-page">
    <PageControls :locale="locale" :home-href="`/${locale}`" :language-href="`/${locale === 'zh' ? 'en' : 'zh'}/resume`" />
    <header class="page-intro resume-intro">
      <p class="eyebrow">{{ t.resume }} · CV</p><h1>{{ t.resumeTitle }}</h1>
      <div><p>{{ profile.bio }}</p><span class="placeholder-badge">{{ t.placeholder }}</span></div>
    </header>
    <div class="resume-layout">
      <aside class="resume-sidebar">
        <div class="resume-monogram" :aria-label="locale === 'zh' ? '职业照片占位' : 'Portrait placeholder'">{{ profile.initials }}</div>
        <div><p class="resume-name">{{ profile.name }}</p><p>{{ profile.role }}</p><p>{{ profile.location }}</p></div>
        <section><h2>{{ t.capabilities }}</h2><ul class="skill-list"><li v-for="skill in profile.skills" :key="skill">{{ skill }}</li></ul></section>
      </aside>
      <div class="resume-sections">
        <section class="resume-section">
          <h2>{{ t.workExperience }}</h2>
          <article v-for="item in profile.experience" :key="`${item.period}-${item.role}`" class="timeline-item">
            <p class="timeline-period">{{ item.period }}</p><div><h3>{{ item.role }}</h3><p class="timeline-company">{{ item.company }}</p><p>{{ item.summary }}</p></div>
          </article>
        </section>
        <section class="resume-section"><h2>{{ t.achievements }}</h2><ol class="outcome-list"><li v-for="(item, index) in profile.achievements" :key="item"><span>{{ String(index + 1).padStart(2, '0') }}</span>{{ item }}</li></ol></section>
        <section class="resume-section"><h2>{{ t.education }}</h2><article v-for="item in profile.education" :key="item.period" class="timeline-item"><p class="timeline-period">{{ item.period }}</p><div><h3>{{ item.degree }}</h3><p class="timeline-company">{{ item.school }}</p></div></article></section>
      </div>
    </div>
  </main>
</template>
