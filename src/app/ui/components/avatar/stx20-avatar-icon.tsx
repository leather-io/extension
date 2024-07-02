import Stx20AvatarIconSrc from '@assets/avatars/stx20-avatar-icon.png';

import { Avatar, AvatarProps } from '@leather.io/ui';

const fallback = 'ST';

export function Stx20AvatarIcon(props: AvatarProps) {
  return (
    <Avatar.Root {...props}>
      <Avatar.Image alt={fallback} src={Stx20AvatarIconSrc} />
      <Avatar.Fallback>{fallback}</Avatar.Fallback>
    </Avatar.Root>
  );
}
