import { Circle, CircleProps } from 'leather-styles/jsx';

import { StxIcon } from '@app/ui/components/icons/stx-icon';

export function StxAvatar({ ...props }: CircleProps) {
  return (
    <Circle
      bg="stacks"
      color="accent.background-primary"
      position="relative"
      size="36px"
      {...props}
    >
      <StxIcon />
    </Circle>
  );
}
