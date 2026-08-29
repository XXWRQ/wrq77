<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import ArticleCard from '@/src/components/ArticleCard.vue';
import PageControls from '@/src/components/PageControls.vue';
import { getArticles } from '@/lib/content';
import { isLocale, taxonomy, ui, type CategoryId, type Locale, type TagId } from '@/lib/site';

const route = useRoute();
const locale = computed<Locale>(() => isLocale(String(route.params.locale)) ? String(route.params.locale) as Locale : 'zh');
const t = computed(() => ui[locale.value]);
const category = computed(() => String(route.query.category ?? '') as CategoryId | '');
const tag = computed(() => String(route.query.tag ?? '') as TagId | '');
const filtered = computed(() => getArticles(locale.value).filter((article) => (!category.value || article.category === category.value) && (!tag.value || article.tags.includes(tag.value as TagId))));
const categoryIds = Object.keys(taxonomy.categories) as CategoryId[];
const tagIds = Object.keys(taxonomy.tags) as TagId[];

function queryFor(nextCategory: string, nextTag: string) {
  const query: Record<string, string> = {};
  if (nextCategory) query.category = nextCategory;
  if (nextTag) query.tag = nextTag;
  return { path: `/${locale.value}/notes`, query };
}
</script>

<template>
  <main id="main-content" class="content-shell page-main notes-page">
    <PageControls :locale="locale" :home-href="`/${locale}`" :language-href="`/${locale === 'zh' ? 'en' : 'zh'}/notes`" />
    <header class="page-intro notes-intro"><p class="eyebrow">{{ t.notes }} · Journal</p><h1>{{ t.notesTitle }}</h1><p>{{ t.notesIntro }}</p></header>
    <section class="filters" :aria-label="locale === 'zh' ? '文章筛选' : 'Note filters'">
      <div class="filter-group"><p>{{ t.categories }}</p><div class="filter-row">
        <RouterLink :class="{ active: !category }" :to="queryFor('', tag)">{{ t.all }}</RouterLink>
        <RouterLink v-for="id in categoryIds" :key="id" :class="{ active: category === id }" :to="queryFor(id, tag)">{{ taxonomy.categories[id][locale] }}</RouterLink>
      </div></div>
      <div class="filter-group"><p>{{ t.tags }}</p><div class="filter-row">
        <RouterLink :class="{ active: !tag }" :to="queryFor(category, '')">{{ t.all }}</RouterLink>
        <RouterLink v-for="id in tagIds" :key="id" :class="{ active: tag === id }" :to="queryFor(category, id)">#{{ taxonomy.tags[id][locale] }}</RouterLink>
      </div></div>
      <RouterLink v-if="category || tag" class="clear-filter" :to="`/${locale}/notes`">{{ t.clear }} ×</RouterLink>
    </section>
    <div v-if="filtered.length" class="article-list"><ArticleCard v-for="(article, index) in filtered" :key="article.translationKey" :article="article" :locale="locale" :index="index" /></div>
    <div v-else class="empty-state"><span aria-hidden="true">∅</span><h2>{{ t.noResults }}</h2><RouterLink :to="`/${locale}/notes`">{{ t.reset }} →</RouterLink></div>
  </main>
</template>
