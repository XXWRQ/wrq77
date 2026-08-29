<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import PageControls from '@/src/components/PageControls.vue';
import NotFoundView from './NotFoundView.vue';
import { getArticle, getTranslation, renderMarkdown } from '@/lib/content';
import { formatDate, isLocale, taxonomy, ui, type Locale } from '@/lib/site';

const route = useRoute();
const locale = computed<Locale>(() => isLocale(String(route.params.locale)) ? String(route.params.locale) as Locale : 'zh');
const article = computed(() => getArticle(locale.value, String(route.params.slug)));
const translation = computed(() => article.value ? getTranslation(article.value, locale.value === 'zh' ? 'en' : 'zh') : undefined);
const rendered = computed(() => article.value ? renderMarkdown(article.value.body) : { html: '', toc: [] });
const t = computed(() => ui[locale.value]);
</script>

<template>
  <NotFoundView v-if="!article" />
  <main v-else id="main-content" class="content-shell article-page">
    <PageControls :locale="locale" :home-href="`/${locale}`" :language-href="translation ? `/${translation.locale}/notes/${translation.slug}` : `/${locale === 'zh' ? 'en' : 'zh'}`" />
    <RouterLink class="back-link" :to="`/${locale}/notes`">← {{ t.backToNotes }}</RouterLink>
    <header class="article-header">
      <div class="article-meta"><span>{{ taxonomy.categories[article.category][locale] }}</span><time :datetime="article.publishedAt">{{ formatDate(article.publishedAt, locale) }}</time><span>{{ article.readingMinutes }} {{ t.minRead }}</span></div>
      <h1>{{ article.title }}</h1><p>{{ article.excerpt }}</p>
      <div class="tag-row"><RouterLink v-for="tag in article.tags" :key="tag" :to="{ path: `/${locale}/notes`, query: { tag } }">#{{ taxonomy.tags[tag][locale] }}</RouterLink></div>
    </header>
    <div class="article-layout">
      <aside class="toc" :aria-label="t.contents"><p>{{ t.contents }}</p><ol><li v-for="item in rendered.toc" :key="item.id" :class="{ nested: item.depth === 3 }"><a :href="`#${item.id}`">{{ item.title }}</a></li></ol><RouterLink v-if="translation" class="translation-link" :to="`/${translation.locale}/notes/${translation.slug}`" :hreflang="translation.locale">{{ t.nextLanguage }} ↗</RouterLink></aside>
      <article class="prose" v-html="rendered.html" />
    </div>
    <footer class="article-end"><span>—</span><p>{{ t.lastUpdated }}: {{ formatDate(article.updatedAt ?? article.publishedAt, locale) }}</p></footer>
  </main>
</template>
