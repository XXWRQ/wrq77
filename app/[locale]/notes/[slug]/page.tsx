import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageControls } from '@/components/page-controls';
import { getArticle, getArticles, getTranslation, renderMarkdown } from '@/lib/content';
import { formatDate, isLocale, taxonomy, ui } from '@/lib/site';

export function generateStaticParams() {
  return (['zh', 'en'] as const).flatMap((locale) => getArticles(locale).map((article) => ({ locale, slug: article.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const article = getArticle(locale, slug);
  if (!article) return {};
  const translation = getTranslation(article, locale === 'zh' ? 'en' : 'zh');
  return {
    title: article.title, description: article.excerpt,
    alternates: { canonical: `/${locale}/notes/${slug}`, languages: translation ? { 'zh-CN': `/zh/notes/${locale === 'zh' ? slug : translation.slug}`, en: `/en/notes/${locale === 'en' ? slug : translation.slug}` } : undefined },
    openGraph: { title: article.title, description: article.excerpt, type: 'article', publishedTime: article.publishedAt, modifiedTime: article.updatedAt, images: [] },
    twitter: { card: 'summary', title: article.title, description: article.excerpt, images: [] },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const article = getArticle(locale, slug);
  if (!article) notFound();
  const translation = getTranslation(article, locale === 'zh' ? 'en' : 'zh');
  const { html, toc } = renderMarkdown(article.body);
  const t = ui[locale];
  return (
    <main id="main-content" className="content-shell article-page">
      <PageControls
        locale={locale}
        homeHref={`/${locale}`}
        languageHref={translation ? `/${translation.locale}/notes/${translation.slug}` : `/${locale === 'zh' ? 'en' : 'zh'}`}
      />
      <a className="back-link" href={`/${locale}/notes`}>← {t.backToNotes}</a>
      <header className="article-header">
        <div className="article-meta"><span>{taxonomy.categories[article.category][locale]}</span><time dateTime={article.publishedAt}>{formatDate(article.publishedAt, locale)}</time><span>{article.readingMinutes} {t.minRead}</span></div>
        <h1>{article.title}</h1><p>{article.excerpt}</p>
        <div className="tag-row">{article.tags.map((tag) => <a key={tag} href={`/${locale}/notes?tag=${tag}`}>#{taxonomy.tags[tag][locale]}</a>)}</div>
      </header>
      <div className="article-layout">
        <aside className="toc" aria-label={t.contents}><p>{t.contents}</p><ol>{toc.map((item) => <li className={item.depth === 3 ? 'nested' : ''} key={item.id}><a href={`#${item.id}`}>{item.title}</a></li>)}</ol>{translation && <a className="translation-link" href={`/${translation.locale}/notes/${translation.slug}`} hrefLang={translation.locale}>{t.nextLanguage} ↗</a>}</aside>
        <article className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      <footer className="article-end"><span>—</span><p>{t.lastUpdated}: {formatDate(article.updatedAt ?? article.publishedAt, locale)}</p></footer>
    </main>
  );
}
