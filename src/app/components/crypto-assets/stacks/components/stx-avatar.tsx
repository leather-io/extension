import { BoxProps, Circle } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { StxIcon } from '@app/components/icons/stx-icon';

import { StacksUnanchoredStatusIcon } from './stacks-unanchored-status-icon';

interface StxAvatarProps extends BoxProps {
  isUnanchored?: boolean;
}
export function StxAvatar({ isUnanchored, ...props }: StxAvatarProps) {
  return (
    <Circle
      bg={token('colors.accent.background-primary')}
      color={token('colors.accent.background-primary')}
      position="relative"
      size="36px"
      {...props}
    >
      <StxIcon />
      {isUnanchored ? <StacksUnanchoredStatusIcon /> : null}
    </Circle>
  );
}
