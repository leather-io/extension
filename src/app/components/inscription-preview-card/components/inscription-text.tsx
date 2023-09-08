// #4164 FIXME migrate - check if there is a radix spinner
import { Spinner } from '@stacks/ui';
import { sanitize } from 'dompurify';
import { Box, styled } from 'leather-styles/jsx';

import { figmaTheme } from '@app/common/utils/figma-theme';
import { useTextInscriptionContentQuery } from '@app/query/bitcoin/ordinals/use-text-ordinal-content.query';

interface InscriptionTextProps {
  contentSrc: string;
}
export function InscriptionText(props: InscriptionTextProps) {
  const query = useTextInscriptionContentQuery(props.contentSrc);

  if (query.isLoading) return <Spinner color={figmaTheme.icon} size="16px" />;

  if (query.isError) return null; // TODO

  return (
    <Box
      height="100%"
      color="white"
      p="20px"
      style={{
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
      <styled.span>{sanitize(query.data)}</styled.span>
    </Box>
  );
}
