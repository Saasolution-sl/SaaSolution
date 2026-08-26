import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from './i18n/language-provider';

export const metadata: Metadata = {
  metadataBase: new URL('https://saasolution.es'),
  title: 'SaaSolutions SL — Company and product preview',
  description: 'Local preview of the existing SaaSolutions company site and the separate SaaSolution Drive product landing page.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body><LanguageProvider>{children}</LanguageProvider></body></html>;
}
