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
const sourceOrderedTags: TagId[] = ['coreRag', 'webServices', 'governanceOps'];
const visibleTagIds = computed(() => sourceOrderedTags.filter((tagId) =>
  getArticles(locale.value).some((article) => article.category === 'learning' && article.tags.includes(tagId)),
));
const activeTag = computed(() => category.value === 'learning' ? tag.value : '');
const filtered = computed(() => {
  const articles = getArticles(locale.value).filter((article) => (!category.value || article.category === category.value) && (!activeTag.value || article.tags.includes(activeTag.value as TagId)));
  if (activeTag.value && sourceOrderedTags.includes(activeTag.value as TagId)) {
    return [...articles].sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER));
  }
  return articles;
});
const categoryIds = Object.keys(taxonomy.categories) as CategoryId[];

function queryFor(nextCategory: string, nextTag: string) {
  const query: Record<string, string> = {};
  if (nextCategory) query.category = nextCategory;
  if (nextTag) query.tag = nextTag;
  return { path: `/${locale.value}/notes`, query };
}
</script>

<template>
  <main id="main-content" class="content-shell page-main notes-page" :class="{ 'notes-page-zh': locale === 'zh' }">
    <PageControls :home-href="`/${locale}`" />
    <header class="page-intro notes-intro"><p v-if="locale !== 'zh'" class="eyebrow">{{ t.notes }} · Journal</p><h1>{{ t.notesTitle }}</h1><p>{{ t.notesIntro }}</p></header>
    <section class="filters" :aria-label="locale === 'zh' ? '文章筛选' : 'Note filters'">
      <div class="filter-group"><p>{{ t.categories }}</p><div class="filter-row">
        <RouterLink :class="{ active: !category }" :to="queryFor('', '')">{{ t.all }}</RouterLink>
        <RouterLink v-for="id in categoryIds" :key="id" :class="{ active: category === id }" :to="queryFor(id, '')">{{ taxonomy.categories[id][locale] }}</RouterLink>
      </div></div>
      <div v-if="category === 'learning' && visibleTagIds.length" class="filter-group"><p>{{ t.tags }}</p><div class="filter-row">
        <RouterLink :class="{ active: !activeTag }" :to="queryFor('learning', '')">{{ t.all }}</RouterLink>
        <RouterLink v-for="id in visibleTagIds" :key="id" :class="{ active: activeTag === id }" :to="queryFor('learning', id)">#{{ taxonomy.tags[id][locale] }}</RouterLink>
      </div></div>
      <RouterLink v-if="category || activeTag" class="clear-filter" :to="`/${locale}/notes`">{{ t.clear }} ×</RouterLink>
    </section>
    <div v-if="filtered.length" class="article-list"><ArticleCard v-for="(article, index) in filtered" :key="article.translationKey" :article="article" :locale="locale" :index="index" /></div>
    <div v-else class="empty-state"><span aria-hidden="true">∅</span><h2>{{ t.noResults }}</h2><RouterLink :to="`/${locale}/notes`">{{ t.reset }} →</RouterLink></div>
  </main>
</template>
