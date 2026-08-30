<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { getArticles } from '@/lib/content';
import { taxonomy, ui, type Locale, type TagId } from '@/lib/site';

const props = defineProps<{ locale: Locale }>();
const t = computed(() => ui[props.locale]);
const route = useRoute();
const drawer = ref<HTMLDetailsElement | null>(null);
const knowledgeGroup = ref<HTMLDetailsElement | null>(null);

const knowledgeTags: TagId[] = ['coreRag', 'webServices', 'governanceOps'];
const ragGroups = computed(() => knowledgeTags.map((tag) => ({
    key: `tag-${tag}`,
    label: taxonomy.tags[tag][props.locale],
    articles: getArticles(props.locale)
      .filter((article) => article.tags.includes(tag))
      .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER)),
})));
const ragArticleCount = computed(() => new Set(
  ragGroups.value.flatMap((group) => group.articles.map((article) => article.translationKey)),
).size);
const softwareArticles = computed(() => getArticles(props.locale)
  .filter((article) => article.category === 'design')
  .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER)));
const methodArticles = computed(() => getArticles(props.locale)
  .filter((article) => article.category === 'methods')
  .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER)));

function closeDrawer() {
  if (drawer.value) drawer.value.open = false;
  if (knowledgeGroup.value) knowledgeGroup.value.open = false;
}

watch(() => route.fullPath, closeDrawer);
</script>

<template>
  <details ref="drawer" class="archive-drawer">
    <summary class="archive-trigger" :class="{ 'archive-trigger-zh': locale === 'zh' }">
      <span class="menu-mark" aria-hidden="true"><i /><i /></span>
      <span class="archive-label-closed">{{ locale === 'zh' ? '菜单' : 'Index' }}</span>
      <span class="archive-label-open">{{ locale === 'zh' ? '收起' : 'Close' }}</span>
    </summary>
    <div class="archive-panel">
      <div class="archive-panel-head"><p>{{ locale === 'zh' ? '我' : 'Personal archive' }}</p><span>01 / 02</span></div>
      <nav class="archive-nav" :aria-label="locale === 'zh' ? '档案导航' : 'Archive navigation'">
        <RouterLink :to="`/${locale}/resume`" @click="closeDrawer"><span>01</span>{{ t.resume }}<b aria-hidden="true">↗</b></RouterLink>
        <details ref="knowledgeGroup" class="archive-nav-group">
          <summary>
            <span>02</span>
            <strong>{{ locale === 'zh' ? '知识库' : t.notes }}</strong>
            <b aria-hidden="true">＋</b>
          </summary>
          <div class="archive-nav-content">
            <RouterLink class="archive-all-link" :to="`/${locale}/notes`" @click="closeDrawer">
              {{ locale === 'zh' ? '查看全部知识库' : t.allNotes }} →
            </RouterLink>
            <details class="archive-primary-group">
              <summary>
                <span>01</span>
                <strong>RAG</strong>
                <small>{{ String(ragArticleCount).padStart(2, '0') }}</small>
                <b aria-hidden="true">＋</b>
              </summary>
              <div class="archive-primary-content">
                <details v-for="(group, groupIndex) in ragGroups" :key="group.key" class="archive-topic-group">
                  <summary>
                    <span>{{ String(groupIndex + 1).padStart(2, '0') }}</span>
                    <strong>{{ group.label }}</strong>
                    <small>{{ String(group.articles.length).padStart(2, '0') }}</small>
                    <b aria-hidden="true">＋</b>
                  </summary>
                  <div class="drawer-notes archive-topic-notes">
                    <RouterLink
                      v-for="(article, articleIndex) in group.articles"
                      :key="article.translationKey"
                      :to="`/${locale}/notes/${article.slug}`"
                      @click="closeDrawer"
                    >
                      <span>{{ String(articleIndex + 1).padStart(2, '0') }}</span>
                      <div><h3>{{ article.title }}</h3></div>
                      <b aria-hidden="true">↗</b>
                    </RouterLink>
                  </div>
                </details>
              </div>
            </details>
            <details class="archive-primary-group">
              <summary><span>02</span><strong>Agent</strong><small>00</small><b aria-hidden="true">＋</b></summary>
              <div class="archive-primary-content"><p class="archive-topic-empty">{{ locale === 'zh' ? '暂无内容' : 'No entries yet' }}</p></div>
            </details>
            <details class="archive-primary-group">
              <summary><span>03</span><strong>{{ taxonomy.categories.design[locale] }}</strong><small>{{ String(softwareArticles.length).padStart(2, '0') }}</small><b aria-hidden="true">＋</b></summary>
              <div class="drawer-notes archive-primary-content archive-primary-notes">
                <RouterLink v-for="(article, articleIndex) in softwareArticles" :key="article.translationKey" :to="`/${locale}/notes/${article.slug}`" @click="closeDrawer">
                  <span>{{ String(articleIndex + 1).padStart(2, '0') }}</span>
                  <div><h3>{{ article.title }}</h3></div>
                  <b aria-hidden="true">↗</b>
                </RouterLink>
              </div>
            </details>
            <details class="archive-primary-group">
              <summary><span>04</span><strong>{{ taxonomy.categories.methods[locale] }}</strong><small>{{ String(methodArticles.length).padStart(2, '0') }}</small><b aria-hidden="true">＋</b></summary>
              <div class="drawer-notes archive-primary-content archive-primary-notes">
                <RouterLink v-for="(article, articleIndex) in methodArticles" :key="article.translationKey" :to="`/${locale}/notes/${article.slug}`" @click="closeDrawer">
                  <span>{{ String(articleIndex + 1).padStart(2, '0') }}</span>
                  <div><h3>{{ article.title }}</h3></div>
                  <b aria-hidden="true">↗</b>
                </RouterLink>
                <p v-if="methodArticles.length === 0" class="archive-topic-empty">{{ locale === 'zh' ? '暂无内容' : 'No entries yet' }}</p>
              </div>
            </details>
          </div>
        </details>
      </nav>
    </div>
  </details>
</template>
