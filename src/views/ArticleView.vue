<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import PageControls from '@/src/components/PageControls.vue';
import NotFoundView from './NotFoundView.vue';
import { getArticle, renderMarkdown } from '@/lib/content';
import { renderMermaidDiagrams } from '@/lib/mermaid';
import { isLocale, taxonomy, ui, type Locale } from '@/lib/site';

const route = useRoute();
const locale = computed<Locale>(() => isLocale(String(route.params.locale)) ? String(route.params.locale) as Locale : 'zh');
const article = computed(() => getArticle(locale.value, String(route.params.slug)));
const rendered = computed(() => article.value ? renderMarkdown(article.value.body) : { html: '', toc: [] });
const t = computed(() => ui[locale.value]);
const proseElement = ref<HTMLElement>();
const lightboxElement = ref<HTMLElement>();
const mediaPreview = ref<
  | { kind: 'image'; src: string; alt: string }
  | { kind: 'diagram'; markup: string; alt: string }
>();
const mediaZoomed = ref(false);
let returnFocusTarget: HTMLImageElement | SVGSVGElement | null = null;
const hasTitleOnlyHeader = computed(() => locale.value === 'zh' && Boolean(article.value && (
  article.value.slug === 'ambiguity-to-action'
  || article.value.category === 'design'
  || article.value.tags.some((tag) => ['coreRag', 'webServices', 'governanceOps'].includes(tag))
)));

async function refreshDiagrams() {
  await nextTick();
  if (!proseElement.value) return;
  try {
    await renderMermaidDiagrams(proseElement.value);
  } finally {
    prepareZoomableMedia();
  }
}

function prepareZoomableMedia() {
  if (!proseElement.value) return;
  proseElement.value.querySelectorAll<HTMLImageElement | SVGSVGElement>('img, pre.mermaid svg').forEach((media) => {
    media.classList.add('zoomable-media');
    media.tabIndex = 0;
    media.setAttribute('role', 'button');
    media.setAttribute('aria-label', locale.value === 'zh' ? '放大查看' : 'Open enlarged view');
  });
}

function getMediaTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return undefined;
  return target.closest<HTMLImageElement | SVGSVGElement>('img.zoomable-media, pre.mermaid svg.zoomable-media') ?? undefined;
}

function openMediaPreview(target: HTMLImageElement | SVGSVGElement) {
  returnFocusTarget = target;
  mediaZoomed.value = false;
  if (target instanceof HTMLImageElement) {
    mediaPreview.value = { kind: 'image', src: target.currentSrc || target.src, alt: target.alt || (locale.value === 'zh' ? '正文图片' : 'Article image') };
  } else {
    const copy = target.cloneNode(true) as SVGSVGElement;
    copy.removeAttribute('style');
    copy.removeAttribute('width');
    copy.removeAttribute('height');
    mediaPreview.value = { kind: 'diagram', markup: copy.outerHTML, alt: locale.value === 'zh' ? '技术图表' : 'Technical diagram' };
  }
  document.documentElement.classList.add('media-lightbox-open');
  void nextTick(() => lightboxElement.value?.focus());
}

function handleProseClick(event: MouseEvent) {
  const target = getMediaTarget(event.target);
  if (target) openMediaPreview(target);
}

function handleProseKeydown(event: KeyboardEvent) {
  if (!['Enter', ' '].includes(event.key)) return;
  const target = getMediaTarget(event.target);
  if (!target) return;
  event.preventDefault();
  openMediaPreview(target);
}

function closeMediaPreview() {
  mediaPreview.value = undefined;
  mediaZoomed.value = false;
  document.documentElement.classList.remove('media-lightbox-open');
  void nextTick(() => returnFocusTarget?.focus());
}

function toggleMediaZoom() {
  mediaZoomed.value = !mediaZoomed.value;
}

onMounted(() => { void refreshDiagrams(); });
watch(() => rendered.value.html, () => {
  if (mediaPreview.value) closeMediaPreview();
  void refreshDiagrams();
}, { flush: 'post' });
onBeforeUnmount(() => document.documentElement.classList.remove('media-lightbox-open'));
</script>

<template>
  <NotFoundView v-if="!article" />
  <main v-else id="main-content" class="content-shell article-page">
    <PageControls :home-href="`/${locale}`" />
    <RouterLink class="back-link" :to="`/${locale}/notes`">← {{ t.backToNotes }}</RouterLink>
    <header class="article-header" :class="{ 'article-header-title-only': hasTitleOnlyHeader }">
      <div v-if="!hasTitleOnlyHeader" class="article-meta"><span>{{ taxonomy.categories[article.category][locale] }}</span></div>
      <h1>{{ article.title }}</h1><p v-if="!hasTitleOnlyHeader">{{ article.excerpt }}</p>
      <div v-if="!hasTitleOnlyHeader" class="tag-row"><RouterLink v-for="tag in article.tags" :key="tag" :to="{ path: `/${locale}/notes`, query: { tag } }">#{{ taxonomy.tags[tag][locale] }}</RouterLink></div>
    </header>
    <div class="article-layout">
      <aside class="toc" :aria-label="t.contents"><p>{{ t.contents }}</p><ol><li v-for="item in rendered.toc" :key="item.id" :class="{ nested: item.depth === 3 }"><a :href="`#${item.id}`">{{ item.title }}</a></li></ol></aside>
      <article ref="proseElement" class="prose" @click="handleProseClick" @keydown="handleProseKeydown" v-html="rendered.html" />
    </div>
  </main>
  <Teleport to="body">
    <div v-if="mediaPreview" ref="lightboxElement" class="media-lightbox" role="dialog" aria-modal="true" :aria-label="locale === 'zh' ? '图片放大查看' : 'Enlarged media view'" tabindex="-1" @click.self="closeMediaPreview" @keydown.esc.stop="closeMediaPreview">
      <button class="media-lightbox-close" type="button" @click="closeMediaPreview" :aria-label="locale === 'zh' ? '关闭放大查看' : 'Close enlarged view'">×</button>
      <div class="media-lightbox-stage" :class="{ 'is-zoomed': mediaZoomed }" @click.stop="toggleMediaZoom">
        <img v-if="mediaPreview.kind === 'image'" :src="mediaPreview.src" :alt="mediaPreview.alt">
        <div v-else class="media-lightbox-svg" role="img" :aria-label="mediaPreview.alt" v-html="mediaPreview.markup" />
      </div>
      <p class="media-lightbox-hint">{{ locale === 'zh' ? '点击图片切换适应窗口／原始尺寸 · Esc 关闭' : 'Click to toggle fit / full size · Esc to close' }}</p>
    </div>
  </Teleport>
</template>
