import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticles } from '@/lib/content';
import { formatDate, isLocale, profiles, taxonomy, ui } from '@/lib/site';

export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const profile = profiles[locale];
  const t = ui[locale];
  const articles = getArticles(locale).slice(0, 2);
  return (
    <main id="main-content" className="content-shell home-page">
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">{locale === 'zh' ? `你好，我是「${profile.name}」` : `Hello, I’m “${profile.name}”`}</p>
          <h1>{profile.headline}</h1>
          <p className="hero-intro">{profile.intro}</p>
          <div className="hero-actions"><Link href={`/${locale}/resume`} className="primary-link">{t.viewResume}<span aria-hidden="true">↗</span></Link><Link href={`/${locale}/notes`} className="text-link">{t.readNotes}<span aria-hidden="true">→</span></Link></div>
        </div>
        <aside className="portrait-panel" aria-label={locale === 'zh' ? '职业照片占位' : 'Professional portrait placeholder'}>
          <div className="portrait-mark" aria-hidden="true">{profile.initials}</div>
          <div className="portrait-caption"><span>{t.currentFocus}</span><p>{profile.focus}</p></div>
        </aside>
      </section>

      <section className="home-section experience-preview">
        <div className="section-heading"><p className="section-kicker">{t.latestExperience}</p><Link href={`/${locale}/resume`}>{t.viewResume} →</Link></div>
        <div className="experience-preview-list">
          {profile.experience.slice(0, 2).map((item) => <article key={`${item.period}-${item.role}`}><p>{item.period}</p><div><h2>{item.role}</h2><span>{item.company}</span><p>{item.summary}</p></div></article>)}
        </div>
      </section>

      <section className="home-section selected-notes">
        <div className="section-heading"><p className="section-kicker">{t.selectedNotes}</p><Link href={`/${locale}/notes`}>{t.allNotes} →</Link></div>
        <div className="selected-notes-grid">
          {articles.map((article, index) => <article key={article.translationKey}><p className="article-number">{String(index + 1).padStart(2, '0')}</p><div className="article-meta"><span>{taxonomy.categories[article.category][locale]}</span><time dateTime={article.publishedAt}>{formatDate(article.publishedAt, locale)}</time></div><h2><Link href={`/${locale}/notes/${article.slug}`}>{article.title}</Link></h2><p>{article.excerpt}</p><Link className="round-arrow" href={`/${locale}/notes/${article.slug}`} aria-label={article.title}>↗</Link></article>)}
        </div>
      </section>
    </main>
  );
}
