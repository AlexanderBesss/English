import type { Metadata } from 'next';
import { DM_Sans, Lora } from 'next/font/google';
import './globals.css';

const sans = DM_Sans({ variable: '--font-sans', subsets: ['latin'] });
const serif = Lora({ variable: '--font-serif', subsets: ['latin'], style: ['normal', 'italic'] });
const siteOrigin = process.env.NEXT_PUBLIC_SITE_ORIGIN ?? 'http://localhost:3000';
const socialImage = `${siteOrigin.replace(/\/$/, '')}/og.png`;
const themeScript = `(function(){try{var saved=localStorage.getItem('fluent-path-theme');var theme=saved==='dark'||saved==='light'?saved:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=theme;}catch(e){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: { default:'Fluent Path — Practical B1+ English', template:'%s | Fluent Path' },
  description: 'A complete B1+ English path with grammar, vocabulary, reading, writing, listening, speaking and focused practice.',
  openGraph: { title:'Fluent Path', description:'Practical B1+ English', type:'website', images:[socialImage] },
  twitter: { card:'summary_large_image', title:'Fluent Path', description:'Practical B1+ English', images:[socialImage] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:themeScript}}/></head><body className={`${sans.variable} ${serif.variable}`}><a className="skip-link" href="#main-content">Skip to content</a>{children}</body></html>;
}
