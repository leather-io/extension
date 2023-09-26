import { Box, Spinner, Text } from '@stacks/ui';
import { sanitize } from 'dompurify';

import { figmaTheme } from '@app/common/utils/figma-theme';
import { useInscriptionTextContentQuery } from '@app/query/bitcoin/ordinals/inscription-text-content.query';

interface InscriptionTextProps {
  contentSrc: string;
}
export function InscriptionText(props: InscriptionTextProps) {
  const query = useInscriptionTextContentQuery(props.contentSrc);

  if (query.isLoading) return <Spinner color={figmaTheme.icon} size="16px" />;

  if (query.isError) return null; // TODO

  return (
    <Box
      height="100%"
      color="white"
      p="20px"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'left',
      }}
      _after={{
        content: '""',
        position: 'absolute',
        bottom: '0',
        left: '0',
        height: '30px',
        width: '100%',
        backgroundImage: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1))',
      }}
    >
      <Text>{sanitize(query.data)}</Text>
    </Box>
  );
}
