import { token } from 'leather-styles/tokens';

import { Avatar, type AvatarProps } from './avatar';

export function RunesAvatarIcon(props: AvatarProps) {
  return (
    <Avatar.Root size="xl" variant="square" {...props}>
      <Avatar.Svg rounded="0">
        <rect width="32" height="32" rx="16" fill={token('colors.ink.background-primary')} />
        <rect width="32" height="32" fill={token('colors.ink.action-primary-default')} />
        <rect x="4" y="4" width="24" height="24" fill={token('colors.ink.background-primary')} />
        <rect
          x="10"
          y="10"
          width="12"
          height="12"
          fill={token('colors.ink.action-primary-default')}
        />
      </Avatar.Svg>
    </Avatar.Root>
  );
}
