import { Box, Text } from '@stacks/ui';

import { useTextInscriptionContentQuery } from '@app/query/bitcoin/ordinals/use-text-ordinal-content.query';

import { CollectibleLayout, CollectibleLayoutProps } from './collectible.layout';

interface CollectibleTextProps extends Omit<CollectibleLayoutProps, 'children'> {
  contentSrc: string;
}

export function CollectibleText(props: CollectibleTextProps) {
  const query = useTextInscriptionContentQuery(props.contentSrc);

  if (query.isLoading) return null; // TODO

  if (query.isError) return null; // TODO

  const { contentSrc, ...rest } = props;
  return (
    <CollectibleLayout {...rest}>
      <Box
        height="100%"
        color="white"
        p="20px"
        sx={{
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
    </CollectibleLayout>
  );
}
