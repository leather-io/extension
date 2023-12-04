import { Circle } from 'leather-styles/jsx';

import { SupportedInscription } from '@shared/models/inscription.model';

import { OrdinalIcon } from '@app/ui/components/icons/ordinal-icon';

export function InscriptionIcon({ inscription, ...rest }: { inscription: SupportedInscription }) {
  switch (inscription.type) {
    case 'image':
      return (
        <Circle
          bg="stacks"
          color="accent.background-primary"
          flexShrink={0}
          position="relative"
          size="36px"
          {...rest}
        >
          <img
            src={inscription.src}
            style={{
              width: '100%',
              height: '100%',
              aspectRatio: '1 / 1',
              objectFit: 'cover',
              borderRadius: '6px',
            }}
          />
        </Circle>
      );
    default:
      return <OrdinalIcon />;
  }
}
