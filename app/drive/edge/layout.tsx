import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SaaSolution Drive Edge | Offline NAS Sync Through Cubbit',
  description: 'Keep files locally available across multiple offices with SaaSolution Drive Edge. Work offline, synchronize through Cubbit and resolve multi-site file conflicts safely.',
  alternates: { canonical: '/drive/edge' },
  openGraph: {
    title: 'SaaSolution Drive Edge | Offline NAS Sync Through Cubbit',
    description: 'Offline-first network storage for every location, with safe multi-site synchronization through Cubbit.',
    url: '/drive/edge',
    siteName: 'SaaSolutions',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'SaaSolution Drive product preview' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaaSolution Drive Edge | Offline NAS Sync Through Cubbit',
    description: 'Offline-first network storage for every location, with safe multi-site synchronization through Cubbit.',
    images: ['/og.png'],
  },
};

export default function EdgeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
