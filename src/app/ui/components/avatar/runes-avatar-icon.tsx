import { Avatar, type AvatarProps } from './avatar';

export function RunesAvatarIcon(props: AvatarProps) {
  return (
    <Avatar.Root size="xl" variant="square" {...props}>
      <Avatar.Svg rounded="0">
        <rect width="32" height="32" rx="16" fill="white" />
        <rect width="32" height="32" fill="#12100F" />
        <rect x="4" y="4" width="24" height="24" fill="white" />
        <rect x="10" y="10" width="12" height="12" fill="#12100F" />
      </Avatar.Svg>
    </Avatar.Root>
  );
}
