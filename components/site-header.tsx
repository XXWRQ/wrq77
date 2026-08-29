import Link from 'next/link';
import type { Locale } from '@/lib/site';
import { ui } from '@/lib/site';

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = ui[locale];
  const otherLocale = locale === 'zh' ? 'en' : 'zh';
  return (
    <header className="site-header">
      <div className="content-shell header-inner">
        <Link href={`/${locale}`} className="wordmark" aria-label={locale === 'zh' ? '个人档案首页' : 'Personal archive home'}>P / A</Link>
        <nav className="primary-nav" aria-label={locale === 'zh' ? '主导航' : 'Primary navigation'}>
          <Link href={`/${locale}`}>{t.home}</Link>
          <Link href={`/${locale}/resume`}>{t.resume}</Link>
          <Link href={`/${locale}/notes`}>{t.notes}</Link>
        </nav>
        <Link href={`/${otherLocale}`} hrefLang={otherLocale} className="language-link" aria-label={locale === 'zh' ? 'Switch to English' : '切换至中文'}>{t.language}</Link>
      </div>
    </header>
  );
}
