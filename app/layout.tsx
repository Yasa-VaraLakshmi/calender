import './globals.css';
import type { Metadata } from 'next';
import { Manrope, Inter } from 'next/font/google';

const manrope = Manrope({ subsets: ['latin'], display: 'swap', variable: '--font-display' });
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-body' });

export const metadata: Metadata = {
  title: 'Premium Wall Calendar',
  description: 'A physical wall calendar inspired component with range selection and notes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <body className="font-body bg-slate-50">{children}</body>
    </html>
  );
}
