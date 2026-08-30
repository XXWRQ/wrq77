import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router';
import { getArticle } from '@/lib/content';
import { profiles, siteOrigin, ui } from '@/lib/site';
import HomeView from './views/HomeView.vue';
import ResumeView from './views/ResumeView.vue';
import NotesView from './views/NotesView.vue';
import ArticleView from './views/ArticleView.vue';
import NotFoundView from './views/NotFoundView.vue';

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to) {
    return to.hash ? { el: to.hash, behavior: 'smooth' } : { top: 0 };
  },
  routes: [
    { path: '/', redirect: '/zh' },
    { path: '/en', redirect: '/zh' },
    { path: '/en/resume', redirect: '/zh/resume' },
    { path: '/en/notes', redirect: (to) => ({ path: '/zh/notes', query: to.query }) },
    { path: '/en/notes/:slug', redirect: (to) => ({ path: `/zh/notes/${String(to.params.slug)}`, query: to.query, hash: to.hash }) },
    { path: '/zh', name: 'home', component: HomeView },
    { path: '/zh/resume', name: 'resume', component: ResumeView },
    { path: '/zh/notes', name: 'notes', component: NotesView },
    { path: '/zh/notes/:slug', name: 'article', component: ArticleView },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
  ],
});

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element!.setAttribute(key, value));
}

function upsertLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    if (hreflang) element.hreflang = hreflang;
    document.head.appendChild(element);
  }
  element.href = href;
}

function routeSeo(to: RouteLocationNormalized) {
  let title = '领域·展开~';
  let description: string = profiles.zh.bio;
  let zhPath = '/zh';

  if (to.name === 'resume') {
    title = '嘿嘿，献丑了~';
    zhPath = '/zh/resume';
  } else if (to.name === 'notes') {
    title = '一起来知识的海洋里~~咕噜咕噜~~';
    description = ui.zh.notesIntro;
    zhPath = '/zh/notes';
  } else if (to.name === 'article') {
    const article = getArticle('zh', String(to.params.slug));
    if (article) {
      title = article.title;
      description = article.excerpt;
      zhPath = to.path;
    }
  } else if (to.name === 'not-found') {
    title = '404 · 页面不存在';
    description = '这一页还没有被写下。';
  }

  const canonical = `${siteOrigin}${to.path}`;
  document.documentElement.lang = 'zh-CN';
  document.title = title;
  upsertMeta('meta[name="description"]', { name: 'description', content: description });
  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: document.title });
  upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: document.title });
  upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
  upsertLink('canonical', canonical);
  document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((element) => element.remove());
  upsertLink('alternate', `${siteOrigin}${zhPath}`, 'zh-CN');
  upsertLink('alternate', `${siteOrigin}${zhPath}`, 'x-default');
}

router.afterEach(routeSeo);

export default router;
