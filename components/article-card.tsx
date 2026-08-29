import type { Article } from '@/lib/content';
import { formatDate, taxonomy, type Locale } from '@/lib/site';

export function ArticleCard({ article, locale, index }: { article: Article; locale: Locale; index: number }) {
  return (
    <article className="article-card">
      <div className="article-index">{String(index + 1).padStart(2, '0')}</div>
      <div className="article-card-copy">
        <div className="article-meta">
          <span>{taxonomy.categories[article.category][locale]}</span>
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt, locale)}</time>
          <span>{article.readingMinutes} {locale === 'zh' ? '分钟' : 'min'}</span>
        </div>
        <h2><a href={`/${locale}/notes/${article.slug}`}>{article.title}</a></h2>
        <p>{article.excerpt}</p>
        <div className="tag-row" aria-label={locale === 'zh' ? '文章标签' : 'Article tags'}>
          {article.tags.map((tag) => <span key={tag}>#{taxonomy.tags[tag][locale]}</span>)}
        </div>
      </div>
      <a className="round-arrow" href={`/${locale}/notes/${article.slug}`} aria-label={article.title}>↗</a>
    </article>
  );
}
