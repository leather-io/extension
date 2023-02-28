import { ReactElement } from 'react';

import { Box, Flex } from '@stacks/ui';

import { OrdinalIconFull } from '@app/components/icons/ordinal-icon-full';
import { CollectibleImageLayout } from '@app/features/collectibles/components/collectible-image.layout';
import { CollectibleTextLayout } from '@app/features/collectibles/components/collectible-text.layout';
import { OrdinalInfo } from '@app/query/bitcoin/ordinals/utils';

interface ImageProps {
  inscription: OrdinalInfo;
}

function OrdinalInscriptionPreviewContainer(props: { children: ReactElement }) {
  return (
    <Box
      width="100px"
      height="100px"
      borderRadius="16px"
      overflow="hidden"
      bg="black"
      position="relative"
    >
      {props.children}
    </Box>
  );
}
export function Image({ inscription }: ImageProps) {
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
  }
}
