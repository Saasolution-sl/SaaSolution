import { ConsultingRoute, metadataForLang, paramsForLang } from '@/components/consulting/route-page';

export const dynamicParams = false;
export const generateStaticParams = () => paramsForLang('en');
export const generateMetadata = ({ params }: { params: Promise<{ path: string[] }> }) => metadataForLang('en', params);
export default function Page({ params }: { params: Promise<{ path: string[] }> }) {
  return <ConsultingRoute lang="en" params={params} />;
}
