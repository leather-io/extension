import type { Inscription } from '@leather-wallet/models';
import { OrdinalAvatarIcon } from '@leather-wallet/ui';
import { Circle } from 'leather-styles/jsx';

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
