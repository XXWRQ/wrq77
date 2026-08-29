import { notFound } from 'next/navigation';
import { HomeArchive } from '@/components/home-archive';
import { PageControls } from '@/components/page-controls';
import { isLocale, profiles, ui } from '@/lib/site';

export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const profile = profiles[locale];
  const t = ui[locale];
  return (
    <main id="main-content" className="home-page">
      <PageControls locale={locale} languageHref={`/${locale === 'zh' ? 'en' : 'zh'}`} />
      <HomeArchive locale={locale} />
      <section className="home-hero">
        <div className="hero-copy">
          <p className="hero-role">{profile.name}<span aria-hidden="true">/</span>{profile.role}<span aria-hidden="true">/</span>{profile.location}</p>
          <h1>{profile.headline}</h1>
          <p className="hero-intro">{profile.intro}</p>
          <div className="hero-actions">
            <a href={`/${locale}/resume`} className="primary-link">{t.viewResume}<span aria-hidden="true">↗</span></a>
            <a href={`/${locale}/notes`} className="text-link">{t.readNotes}<span aria-hidden="true">→</span></a>
          </div>
        </div>
        <aside className="identity-orbit" aria-label={locale === 'zh' ? '个人信息占位' : 'Profile placeholder'}>
          <div className="orbit-line" aria-hidden="true" />
          <div className="identity-mark" aria-hidden="true">{profile.initials}</div>
          <div className="focus-note"><span>{t.currentFocus}</span><p>{profile.focus}</p></div>
        </aside>
      </section>
    </main>
  );
}
