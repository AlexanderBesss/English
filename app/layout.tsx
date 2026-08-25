import type { Metadata } from 'next';
import { DM_Sans, Lora } from 'next/font/google';
import './globals.css';

const sans = DM_Sans({ variable: '--font-sans', subsets: ['latin'] });
const serif = Lora({ variable: '--font-serif', subsets: ['latin'], style: ['normal', 'italic'] });

export const metadata: Metadata = {
  title: { default:'Fluent Path — English from B1 to B2', template:'%s | Fluent Path' },
  description: 'Focused English lessons, practice and reference tools for moving confidently from B1 to B2.',
  openGraph: { title:'Fluent Path', description:'English from B1 to B2', type:'website' },
  twitter: { card:'summary_large_image', title:'Fluent Path', description:'English from B1 to B2' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${sans.variable} ${serif.variable}`}><a className="skip-link" href="#main-content">Skip to content</a>{children}</body></html>;
}

