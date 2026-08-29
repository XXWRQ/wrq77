import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router';
import { getArticle, getTranslation } from '@/lib/content';
import { isLocale, profiles, siteOrigin, ui, type Locale } from '@/lib/site';
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
    { path: '/:locale(zh|en)', name: 'home', component: HomeView },
    { path: '/:locale(zh|en)/resume', name: 'resume', component: ResumeView },
    { path: '/:locale(zh|en)/notes', name: 'notes', component: NotesView },
    { path: '/:locale(zh|en)/notes/:slug', name: 'article', component: ArticleView },
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
  const rawLocale = String(to.params.locale ?? 'zh');
  const locale: Locale = isLocale(rawLocale) ? rawLocale : 'zh';
  let title: string = profiles[locale].name;
  let description: string = profiles[locale].bio;
  let zhPath = '/zh';
  let enPath = '/en';

  if (to.name === 'resume') {
    title = ui[locale].resume;
    zhPath = '/zh/resume';
    enPath = '/en/resume';
  } else if (to.name === 'notes') {
    title = ui[locale].notes;
    description = ui[locale].notesIntro;
    zhPath = '/zh/notes';
    enPath = '/en/notes';
  } else if (to.name === 'article') {
    const article = getArticle(locale, String(to.params.slug));
    if (article) {
      title = article.title;
      description = article.excerpt;
      const translation = getTranslation(article, locale === 'zh' ? 'en' : 'zh');
      zhPath = locale === 'zh' ? to.path : translation ? `/zh/notes/${translation.slug}` : '/zh';
      enPath = locale === 'en' ? to.path : translation ? `/en/notes/${translation.slug}` : '/en';
    }
  } else if (to.name === 'not-found') {
    title = '404 · Not found';
    description = 'This page has not been written yet.';
  }

  const canonical = `${siteOrigin}${to.path}`;
  document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
  document.title = `${title} · ${profiles[locale].role}`;
  upsertMeta('meta[name="description"]', { name: 'description', content: description });
  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: document.title });
  upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: document.title });
  upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
  upsertLink('canonical', canonical);
  upsertLink('alternate', `${siteOrigin}${zhPath}`, 'zh-CN');
  upsertLink('alternate', `${siteOrigin}${enPath}`, 'en');
  upsertLink('alternate', `${siteOrigin}${zhPath}`, 'x-default');
}

router.afterEach(routeSeo);

export default router;
