import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteShell from '../../../components/site/site-shell';
import { productPages } from '../../../components/site/pages-content';

export const dynamicParams = false;
export function generateStaticParams() {
  return productPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = productPages.find((p) => p.slug === slug);
  return page ? { title: `${page.title} — SaaSolutions SL`, description: page.intro, alternates: { canonical: `/products/${page.slug}` } } : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = productPages.find((p) => p.slug === slug);
  if (!page) notFound();
  return <SiteShell page={page} />;
}
