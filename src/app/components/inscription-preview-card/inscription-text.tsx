import { useGetInscriptionTextContentQuery } from '@leather.io/query';
import { InscriptionTextLayout, LoadingSpinner } from '@leather.io/ui';

import { parseJson } from '@app/components/json';

interface InscriptionTextProps {
  contentSrc: string;
}
export function InscriptionText(props: InscriptionTextProps) {
  const query = useGetInscriptionTextContentQuery(props.contentSrc);

  if (query.isLoading) return <LoadingSpinner size="16px" />;

  if (query.isError) return null; // TODO

  return <InscriptionTextLayout content={parseJson(query.data)} />;
}
