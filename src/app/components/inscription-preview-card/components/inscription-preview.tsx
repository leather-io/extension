import { BoxProps, Flex } from 'leather-styles/jsx';

import { SupportedInscription } from '@shared/models/inscription.model';

import { OrdinalAvatarIcon } from '@app/ui/components/avatar/ordinal-avatar-icon';

import { InscriptionImage } from './inscription-image';
import { InscriptionPreviewContainer } from './inscription-preview-container';
import { InscriptionText } from './inscription-text';

interface InscriptionPreviewProps extends BoxProps {
  inscription: SupportedInscription;
}
export function InscriptionPreview({ inscription, ...props }: InscriptionPreviewProps) {
  switch (inscription.type) {
    case 'image': {
      return (
        <InscriptionPreviewContainer {...props}>
          <InscriptionImage src={inscription.src} />
        </InscriptionPreviewContainer>
      );
    }
    case 'text': {
      return (
        <InscriptionPreviewContainer {...props}>
          <InscriptionText contentSrc={inscription.contentSrc} />
        </InscriptionPreviewContainer>
      );
    }
    case 'other': {
      return (
        <InscriptionPreviewContainer {...props}>
          <Flex alignItems="center" height="100%" justifyContent="center">
            <OrdinalAvatarIcon size="xl" />
          </Flex>
        </InscriptionPreviewContainer>
      );
    }
    default:
      return null;
  }
}
