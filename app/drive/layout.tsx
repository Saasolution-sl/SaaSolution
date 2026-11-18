import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SaaSolution Drive — Your files, quietly protected',
  description: 'A private cloud-drive experience for files, photos and messaging backups by SaaSolutions SL.',
  icons: {
    icon: '/windows-app-icon.png',
    apple: '/windows-app-icon.png',
  },
  openGraph: {
    title: 'SaaSolution Drive — Your files, quietly protected',
    description: 'A calm, privacy-focused drive experience for your files, photos and messaging backups.',
    images: ['/og.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaaSolution Drive — Your files, quietly protected',
    description: 'A calm, privacy-focused drive experience for your files, photos and messaging backups.',
    images: ['/og.png'],
  },
};

export default function DriveLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
