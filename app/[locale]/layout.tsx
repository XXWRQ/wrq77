import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { isLocale, profiles, siteOrigin, ui } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const title = locale === 'zh' ? '个人档案' : 'Personal Archive';
  const description = locale === 'zh' ? '经历、方法与持续学习的双语个人档案。' : 'A bilingual archive of experience, methods, and ongoing learning.';
  return {
    metadataBase: new URL(siteOrigin),
    title: { default: title, template: `%s · ${profiles[locale].name}` },
    description,
    alternates: { canonical: `/${locale}`, languages: { 'zh-CN': '/zh', en: '/en' } },
    openGraph: { type: 'website', title, description, locale: locale === 'zh' ? 'zh_CN' : 'en_US', images: [{ url: '/og.png', width: 1536, height: 1024, alt: '个人档案 / Personal Archive' }] },
    twitter: { card: 'summary_large_image', title, description, images: ['/og.png'] },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <div lang={locale === 'zh' ? 'zh-CN' : 'en'} className="locale-frame">
      <a className="skip-link" href="#main-content">{locale === 'zh' ? '跳到主要内容' : 'Skip to content'}</a>
      <SiteHeader locale={locale} />
      {children}
      <SiteFooter locale={locale} />
    </div>
  );
}
