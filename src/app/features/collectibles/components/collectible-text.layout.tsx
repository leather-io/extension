import { Box, Text } from '@stacks/ui';

import { useTextInscriptionContentQuery } from '@app/query/bitcoin/ordinals/use-text-ordinal-content.query';

interface CollectibleTextLayoutProps {
  contentSrc: string;
}

export function CollectibleTextLayout(props: CollectibleTextLayoutProps) {
  const query = useTextInscriptionContentQuery(props.contentSrc);

  if (query.isLoading) return null; // TODO

  if (query.isError) return null; // TODO

  return (
    <Box
      height="100%"
      width="100%"
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
      <Text>{query.data}</Text>
    </Box>
  );
}
