import { BoxProps, Flex } from 'leather-styles/jsx';

import { SupportedInscription } from '@shared/models/inscription.model';

import { OrdinalIcon } from '@app/ui/components/icons/ordinal-icon';

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
            <OrdinalIcon size="40px" />
          </Flex>
        </InscriptionPreviewContainer>
      );
    }
    default:
      return null;
  }
}
