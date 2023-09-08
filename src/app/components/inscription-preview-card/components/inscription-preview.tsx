import { Box, BoxProps, Flex } from 'leather-styles/jsx';

import { SupportedInscription } from '@shared/models/inscription.model';

import { OrdinalIconFull } from '@app/components/icons/ordinal-icon-full';

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
          <Flex justifyContent="center" alignItems="center" height="100%">
            <Box width="40px">
              <OrdinalIconFull width={40} height={40} />
            </Box>
          </Flex>
        </InscriptionPreviewContainer>
      );
    }
    default:
      return null;
  }
}
