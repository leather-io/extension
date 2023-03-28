import { Box, Flex } from '@stacks/ui';

import { SupportedInscription } from '@shared/models/inscription.model';

import { OrdinalIconFull } from '@app/components/icons/ordinal-icon-full';

import { InscriptionImage } from './inscription-image';
import { InscriptionPreviewContainer } from './inscription-preview-container';
import { InscriptionText } from './inscription-text';

interface InscriptionPreviewProps {
  inscription: SupportedInscription;
}
export function InscriptionPreview({ inscription }: InscriptionPreviewProps) {
  switch (inscription.type) {
    case 'image': {
      return (
        <InscriptionPreviewContainer>
          <InscriptionImage src={inscription.src} />
        </InscriptionPreviewContainer>
      );
    }
    case 'text': {
      return (
        <InscriptionPreviewContainer>
          <InscriptionText contentSrc={inscription.contentSrc} />
        </InscriptionPreviewContainer>
      );
    }
    case 'other': {
      return (
        <InscriptionPreviewContainer>
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
