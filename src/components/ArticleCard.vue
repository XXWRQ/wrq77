<script setup lang="ts">
import { RouterLink } from 'vue-router';
import type { Article } from '@/lib/content';
import { formatDate, taxonomy, type Locale } from '@/lib/site';

defineProps<{ article: Article; locale: Locale; index: number }>();
</script>

<template>
  <article class="article-card">
    <div class="article-index">{{ String(index + 1).padStart(2, '0') }}</div>
    <div class="article-card-copy">
      <div class="article-meta">
        <span>{{ taxonomy.categories[article.category][locale] }}</span>
        <time :datetime="article.publishedAt">{{ formatDate(article.publishedAt, locale) }}</time>
        <span>{{ article.readingMinutes }} {{ locale === 'zh' ? '分钟' : 'min' }}</span>
      </div>
      <h2><RouterLink :to="`/${locale}/notes/${article.slug}`">{{ article.title }}</RouterLink></h2>
      <p>{{ article.excerpt }}</p>
      <div class="tag-row" :aria-label="locale === 'zh' ? '文章标签' : 'Article tags'">
        <span v-for="tag in article.tags" :key="tag">#{{ taxonomy.tags[tag][locale] }}</span>
      </div>
    </div>
    <RouterLink class="round-arrow" :to="`/${locale}/notes/${article.slug}`" :aria-label="article.title">↗</RouterLink>
  </article>
</template>
