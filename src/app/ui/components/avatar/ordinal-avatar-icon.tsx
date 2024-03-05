import { Avatar, type AvatarProps } from './avatar';

export function OrdinalAvatarIcon(props: AvatarProps) {
  return (
    <Avatar.Root {...props}>
      <Avatar.Svg>
        <circle cx="16" cy="16" r="16" fill="#0C0C0D" />
        <circle cx="16" cy="16" r="12" fill="white" />
        <circle cx="16" cy="16" r="6" fill="#0C0C0D" />
      </Avatar.Svg>
    </Avatar.Root>
  );
}
