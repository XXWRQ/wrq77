import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, profiles, ui } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const title = ui[locale].resume;
  return { title, description: profiles[locale].bio, alternates: { canonical: `/${locale}/resume`, languages: { 'zh-CN': '/zh/resume', en: '/en/resume' } } };
}

export default async function ResumePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const profile = profiles[locale];
  const t = ui[locale];
  return (
    <main id="main-content" className="content-shell page-main resume-page">
      <header className="page-intro resume-intro">
        <p className="eyebrow">{t.resume} · CV</p>
        <h1>{t.resumeTitle}</h1>
        <div><p>{profile.bio}</p><span className="placeholder-badge">{t.placeholder}</span></div>
      </header>

      <div className="resume-layout">
        <aside className="resume-sidebar">
          <div className="resume-monogram" aria-label={locale === 'zh' ? '职业照片占位' : 'Portrait placeholder'}>{profile.initials}</div>
          <div><p className="resume-name">{profile.name}</p><p>{profile.role}</p><p>{profile.location}</p></div>
          <section><h2>{t.capabilities}</h2><ul className="skill-list">{profile.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul></section>
        </aside>

        <div className="resume-sections">
          <section className="resume-section">
            <h2>{t.workExperience}</h2>
            {profile.experience.map((item) => (
              <article className="timeline-item" key={`${item.period}-${item.role}`}>
                <p className="timeline-period">{item.period}</p>
                <div><h3>{item.role}</h3><p className="timeline-company">{item.company}</p><p>{item.summary}</p></div>
              </article>
            ))}
          </section>
          <section className="resume-section">
            <h2>{t.achievements}</h2>
            <ol className="outcome-list">{profile.achievements.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, '0')}</span>{item}</li>)}</ol>
          </section>
          <section className="resume-section">
            <h2>{t.education}</h2>
            {profile.education.map((item) => <article className="timeline-item" key={item.period}><p className="timeline-period">{item.period}</p><div><h3>{item.degree}</h3><p className="timeline-company">{item.school}</p></div></article>)}
          </section>
        </div>
      </div>
    </main>
  );
}
