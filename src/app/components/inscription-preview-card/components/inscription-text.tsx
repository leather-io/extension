import { sanitize } from 'dompurify';
import { Box } from 'leather-styles/jsx';

import { parseJson } from '@app/components/json';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { useInscriptionTextContentQuery } from '@app/query/bitcoin/ordinals/inscription-text-content.query';

interface InscriptionTextProps {
  contentSrc: string;
}
export function InscriptionText(props: InscriptionTextProps) {
  const query = useInscriptionTextContentQuery(props.contentSrc);

  if (query.isLoading) return <LoadingSpinner size="16px" />;

  if (query.isError) return null; // TODO

  return (
    <Box
      _after={{
        content: '""',
        position: 'absolute',
        bottom: '0',
        left: '0',
        height: '30px',
        width: '100%',
        backgroundImage: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1))',
      }}
      color="white"
      fontSize="9px"
      height="100%"
      p="space.03"
      position="relative"
      overflow="hidden"
      textAlign="left"
      width="100%"
    >
      <pre>{sanitize(parseJson(query.data))}</pre>
    </Box>
  );
}
