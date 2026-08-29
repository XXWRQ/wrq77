import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleCard } from '@/components/article-card';
import { PageControls } from '@/components/page-controls';
import { getArticles } from '@/lib/content';
import { isLocale, taxonomy, type CategoryId, type TagId, ui } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: ui[locale].notes, description: ui[locale].notesIntro, alternates: { canonical: `/${locale}/notes`, languages: { 'zh-CN': '/zh/notes', en: '/en/notes' } } };
}

function filterHref(locale: string, current: { category?: string; tag?: string }, key: 'category' | 'tag', value: string) {
  const query = new URLSearchParams();
  if (current.category && key !== 'category') query.set('category', current.category);
  if (current.tag && key !== 'tag') query.set('tag', current.tag);
  if (current[key] !== value) query.set(key, value);
  const suffix = query.toString();
  return `/${locale}/notes${suffix ? `?${suffix}` : ''}`;
}

export default async function NotesPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ category?: string; tag?: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const query = await searchParams;
  const category = query.category && query.category in taxonomy.categories ? query.category as CategoryId : undefined;
  const tag = query.tag && query.tag in taxonomy.tags ? query.tag as TagId : undefined;
  const current = { category, tag };
  const articles = getArticles(locale).filter((article) => (!category || article.category === category) && (!tag || article.tags.includes(tag)));
  const t = ui[locale];

  return (
    <main id="main-content" className="content-shell page-main notes-page">
      <PageControls locale={locale} homeHref={`/${locale}`} languageHref={`/${locale === 'zh' ? 'en' : 'zh'}/notes`} />
      <header className="page-intro notes-intro"><p className="eyebrow">{t.notes} · Journal</p><h1>{t.notesTitle}</h1><p>{t.notesIntro}</p></header>
      <section className="filters" aria-label={locale === 'zh' ? '文章筛选' : 'Note filters'}>
        <div className="filter-group"><p>{t.categories}</p><div className="filter-row"><a className={!category ? 'active' : ''} href={`/${locale}/notes`}>{t.all}</a>{Object.entries(taxonomy.categories).map(([id, label]) => <a className={category === id ? 'active' : ''} aria-current={category === id ? 'true' : undefined} key={id} href={filterHref(locale, current, 'category', id)}>{label[locale]}</a>)}</div></div>
        <div className="filter-group"><p>{t.tags}</p><div className="filter-row">{Object.entries(taxonomy.tags).map(([id, label]) => <a className={tag === id ? 'active' : ''} aria-current={tag === id ? 'true' : undefined} key={id} href={filterHref(locale, current, 'tag', id)}>#{label[locale]}</a>)}</div></div>
        {(category || tag) && <a className="clear-filter" href={`/${locale}/notes`}>{t.clear} ×</a>}
      </section>
      <section className="article-list" aria-live="polite">
        {articles.length > 0 ? articles.map((article, index) => <ArticleCard key={article.translationKey} article={article} locale={locale} index={index} />) : <div className="empty-state"><span>Ø</span><h2>{t.noResults}</h2><a href={`/${locale}/notes`}>{t.reset} →</a></div>}
      </section>
    </main>
  );
}
