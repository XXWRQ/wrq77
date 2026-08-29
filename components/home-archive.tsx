import { getArticles } from '@/lib/content';
import { formatDate, profiles, taxonomy, ui, type Locale } from '@/lib/site';

export function HomeArchive({ locale }: { locale: Locale }) {
  const profile = profiles[locale];
  const articles = getArticles(locale).slice(0, 2);
  const t = ui[locale];

  return (
    <details className="archive-drawer">
      <summary className="archive-trigger">
        <span className="menu-mark" aria-hidden="true"><i /><i /></span>
        <span className="archive-label-closed">{locale === 'zh' ? '档案' : 'Index'}</span>
        <span className="archive-label-open">{locale === 'zh' ? '收起' : 'Close'}</span>
      </summary>

      <div className="archive-panel">
        <div className="archive-panel-head">
          <p>{locale === 'zh' ? '个人档案' : 'Personal archive'}</p>
          <span>01 / 02</span>
        </div>

        <nav className="archive-nav" aria-label={locale === 'zh' ? '档案导航' : 'Archive navigation'}>
          <a href={`/${locale}/resume`}><span>01</span>{t.resume}<b aria-hidden="true">↗</b></a>
          <a href={`/${locale}/notes`}><span>02</span>{t.notes}<b aria-hidden="true">↗</b></a>
        </nav>

        <section className="drawer-section">
          <div className="drawer-section-title">
            <h2>{t.latestExperience}</h2>
            <a href={`/${locale}/resume`}>{locale === 'zh' ? '完整简历' : 'Full résumé'} →</a>
          </div>
          <div className="drawer-timeline">
            {profile.experience.slice(0, 2).map((item) => (
              <article key={`${item.period}-${item.role}`}>
                <p>{item.period}</p>
                <h3>{item.role}</h3>
                <span>{item.company}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="drawer-section">
          <div className="drawer-section-title">
            <h2>{t.selectedNotes}</h2>
            <a href={`/${locale}/notes`}>{t.allNotes} →</a>
          </div>
          <div className="drawer-notes">
            {articles.map((article, index) => (
              <a href={`/${locale}/notes/${article.slug}`} key={article.translationKey}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <p>{taxonomy.categories[article.category][locale]} · {formatDate(article.publishedAt, locale)}</p>
                  <h3>{article.title}</h3>
                </div>
                <b aria-hidden="true">↗</b>
              </a>
            ))}
          </div>
        </section>
      </div>
    </details>
  );
}
