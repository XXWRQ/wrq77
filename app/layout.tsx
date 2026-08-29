import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '个人档案 / Personal Archive',
  description: '一份关于经历、思考与持续学习的双语个人档案。',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
