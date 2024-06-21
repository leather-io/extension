import { Circle } from 'leather-styles/jsx';

import type { Inscription } from '@leather.io/models';
import { OrdinalAvatarIcon } from '@leather.io/ui';

export function InscriptionIcon({ inscription, ...rest }: { inscription: Inscription }) {
  switch (inscription.mimeType) {
    case 'image':
      return (
        <Circle
          bg="stacks"
          color="ink.background-primary"
          flexShrink={0}
          position="relative"
          size="xl"
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
      return <OrdinalAvatarIcon />;
  }
}
