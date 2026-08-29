import type { Locale } from '@/lib/site';

export function PageControls({
  locale,
  homeHref,
  languageHref,
}: {
  locale: Locale;
  homeHref?: string;
  languageHref: string;
}) {
  return (
    <nav className="page-controls" aria-label={locale === 'zh' ? '页面导航' : 'Page navigation'}>
      {homeHref && (
        <a className="control-link home-control" href={homeHref}>
          <span aria-hidden="true">←</span>
          {locale === 'zh' ? '首页' : 'Home'}
        </a>
      )}
      <a
        className="control-link language-control"
        href={languageHref}
        hrefLang={locale === 'zh' ? 'en' : 'zh'}
        aria-label={locale === 'zh' ? 'Switch to English' : '切换至中文'}
      >
        {locale === 'zh' ? 'EN' : '中文'}
      </a>
    </nav>
  );
}
