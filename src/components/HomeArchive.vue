<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { getArticles } from '@/lib/content';
import { formatDate, profiles, taxonomy, ui, type Locale } from '@/lib/site';

const props = defineProps<{ locale: Locale }>();
const profile = computed(() => profiles[props.locale]);
const articles = computed(() => getArticles(props.locale).slice(0, 2));
const t = computed(() => ui[props.locale]);
</script>

<template>
  <details class="archive-drawer">
    <summary class="archive-trigger">
      <span class="menu-mark" aria-hidden="true"><i /><i /></span>
      <span class="archive-label-closed">{{ locale === 'zh' ? '档案' : 'Index' }}</span>
      <span class="archive-label-open">{{ locale === 'zh' ? '收起' : 'Close' }}</span>
    </summary>
    <div class="archive-panel">
      <div class="archive-panel-head"><p>{{ locale === 'zh' ? '个人档案' : 'Personal archive' }}</p><span>01 / 02</span></div>
      <nav class="archive-nav" :aria-label="locale === 'zh' ? '档案导航' : 'Archive navigation'">
        <RouterLink :to="`/${locale}/resume`"><span>01</span>{{ t.resume }}<b aria-hidden="true">↗</b></RouterLink>
        <RouterLink :to="`/${locale}/notes`"><span>02</span>{{ t.notes }}<b aria-hidden="true">↗</b></RouterLink>
      </nav>
      <section class="drawer-section">
        <div class="drawer-section-title"><h2>{{ t.latestExperience }}</h2><RouterLink :to="`/${locale}/resume`">{{ locale === 'zh' ? '完整简历' : 'Full résumé' }} →</RouterLink></div>
        <div class="drawer-timeline">
          <article v-for="item in profile.experience.slice(0, 2)" :key="`${item.period}-${item.role}`">
            <p>{{ item.period }}</p><h3>{{ item.role }}</h3><span>{{ item.company }}</span>
          </article>
        </div>
      </section>
      <section class="drawer-section">
        <div class="drawer-section-title"><h2>{{ t.selectedNotes }}</h2><RouterLink :to="`/${locale}/notes`">{{ t.allNotes }} →</RouterLink></div>
        <div class="drawer-notes">
          <RouterLink v-for="(article, index) in articles" :key="article.translationKey" :to="`/${locale}/notes/${article.slug}`">
            <span>{{ String(index + 1).padStart(2, '0') }}</span>
            <div><p>{{ taxonomy.categories[article.category][locale] }} · {{ formatDate(article.publishedAt, locale) }}</p><h3>{{ article.title }}</h3></div>
            <b aria-hidden="true">↗</b>
          </RouterLink>
        </div>
      </section>
    </div>
  </details>
</template>
