import Link from 'next/link';
import type { Locale } from '@/lib/site';
import { profiles, ui } from '@/lib/site';

export function SiteFooter({ locale }: { locale: Locale }) {
  const profile = profiles[locale];
  return (
    <footer className="site-footer">
      <div className="content-shell footer-grid">
        <p className="footer-title">{profile.name}</p>
        <p>{ui[locale].footer}</p>
        <div className="footer-links">
          {profile.socials.map((social) => <a key={social.url} href={social.url} target="_blank" rel="noreferrer">{social.label}</a>)}
          <Link href={`/${locale}/notes`}>{ui[locale].notes} ↗</Link>
        </div>
      </div>
    </footer>
  );
}
