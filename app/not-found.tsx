import Link from 'next/link';

export default function NotFound() {
  return <main className="not-found"><p className="eyebrow">404 · Not found</p><h1>这一页还没有被写下。<br />This page has not been written yet.</h1><div><Link href="/zh">返回中文首页</Link><Link href="/en">English home</Link></div></main>;
}
