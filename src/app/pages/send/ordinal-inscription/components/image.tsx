import { ReactElement } from 'react';

import { Box, Flex, Text } from '@stacks/ui';

import { OrdinalIconFull } from '@app/components/icons/ordinal-icon-full';
import { useTextInscriptionContentQuery } from '@app/query/bitcoin/ordinals/use-text-ordinal-content.query';

// import { OrdinalInfo } from '@app/query/bitcoin/ordinals/utils';

function OrdinalInscriptionPreviewContainer(props: { children: ReactElement }) {
  return (
    <Box
      width="100px"
      height="100px"
      borderRadius="8px"
      overflow="hidden"
      bg="black"
      position="relative"
    >
      {props.children}
    </Box>
  );
}

// Duplicating to get past deps cruiser errors but need to revisit
// collectible code sharing
interface ImageCollectibleProps {
  src: string;
}
function CollectibleImageLayout({ src }: ImageCollectibleProps) {
  return (
    <img
      src={src}
      style={{ width: '100%', height: '100%', aspectRatio: '1 / 1', objectFit: 'cover' }}
    />
  );
}

// Same here
interface CollectibleTextLayoutProps {
  contentSrc: string;
}
function CollectibleTextLayout(props: CollectibleTextLayoutProps) {
  const query = useTextInscriptionContentQuery(props.contentSrc);

  if (query.isLoading) return null; // TODO

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
      <Text>{query.data}</Text>
    </Box>
  );
}

// TODO: Resolve types
interface ImageProps {
  inscription: any;
}
export function CollectibleImage({ inscription }: ImageProps) {
  switch (inscription.type) {
    case 'image': {
      return (
        <OrdinalInscriptionPreviewContainer>
          <CollectibleImageLayout src={inscription.src} />
        </OrdinalInscriptionPreviewContainer>
      );
    }
    case 'text': {
      return (
        <OrdinalInscriptionPreviewContainer>
          <CollectibleTextLayout contentSrc={inscription.contentSrc} />
        </OrdinalInscriptionPreviewContainer>
      );
    }
    case 'other': {
      return (
        <OrdinalInscriptionPreviewContainer>
          <Flex justifyContent="center" alignItems="center" height="100%">
            <Box width="40px">
              <OrdinalIconFull width={40} height={40} />
            </Box>
          </Flex>
        </OrdinalInscriptionPreviewContainer>
      );
    }
    default:
      return null;
  }
}
