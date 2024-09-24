import { BoxProps, Flex } from 'leather-styles/jsx';

import type { Inscription } from '@leather.io/models';
import { InscriptionImage, InscriptionPreviewLayout, OrdinalAvatarIcon } from '@leather.io/ui';

import { InscriptionText } from './inscription-text';

interface InscriptionPreviewProps extends BoxProps {
  inscription: Inscription;
}
export function InscriptionPreview({ inscription, ...props }: InscriptionPreviewProps) {
  switch (inscription.mimeType) {
    case 'image': {
      return (
        <InscriptionPreviewLayout {...props}>
          <InscriptionImage src={inscription.src} />
        </InscriptionPreviewLayout>
      );
    }
    case 'text': {
      return (
        <InscriptionPreviewLayout {...props}>
          <InscriptionText contentSrc={inscription.src} />
        </InscriptionPreviewLayout>
      );
    }
    case 'other': {
      return (
        <InscriptionPreviewLayout {...props}>
          <Flex alignItems="center" height="100%" justifyContent="center">
            <OrdinalAvatarIcon size="xl" />
          </Flex>
        </InscriptionPreviewLayout>
      );
    }
    default:
      return null;
  }
}
