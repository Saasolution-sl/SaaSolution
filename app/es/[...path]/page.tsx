import { ConsultingRoute, metadataForLang, paramsForLang } from '@/components/consulting/route-page';

export const dynamicParams = false;
export const generateStaticParams = () => paramsForLang('es');
export const generateMetadata = ({ params }: { params: Promise<{ path: string[] }> }) => metadataForLang('es', params);
export default function Page({ params }: { params: Promise<{ path: string[] }> }) {
  return <ConsultingRoute lang="es" params={params} />;
}
