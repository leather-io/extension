import { Circle, CircleProps } from 'leather-styles/jsx';

import { StxIcon } from '@app/ui/components/icons/stx-icon';

import { StacksUnanchoredStatusIcon } from './stacks-unanchored-status-icon';

interface StxAvatarProps extends CircleProps {
  isUnanchored?: boolean;
}
export function StxAvatar({ isUnanchored, ...props }: StxAvatarProps) {
  return (
    <Circle
      bg="stacks"
      color="accent.background-primary"
      position="relative"
      size="36px"
      {...props}
    >
      <StxIcon />
      {isUnanchored ? <StacksUnanchoredStatusIcon /> : null}
    </Circle>
  );
}
