import { Box, BoxProps } from 'leather-styles/jsx';

import { Avatar, defaultFallbackDelay } from '@app/ui/components/avatar/avatar';
import { StxAvatarIcon } from '@app/ui/components/avatar/stx-avatar-icon';
import { DynamicColorCircle } from '@app/ui/components/dynamic-color-circle';

interface StacksAssetAvatarProps extends BoxProps {
  gradientString?: string;
  imageCanonicalUri?: string;
  isStx?: boolean;
  size?: string;
}
export function StacksAssetAvatar({
  children,
  gradientString,
  imageCanonicalUri,
  isStx,
  size = '36',
  ...props
}: StacksAssetAvatarProps) {
  if (isStx) return <StxAvatarIcon />;

  const { color } = props;

  if (imageCanonicalUri)
    return (
      <Avatar.Root>
        <Avatar.Image alt="FT" src={encodeURI(imageCanonicalUri)} />
        <Avatar.Fallback delayMs={defaultFallbackDelay}>FT</Avatar.Fallback>
      </Avatar.Root>
    );

  if (!gradientString) return null;

  return (
    <DynamicColorCircle color={color} size={size} value={gradientString}>
      <Box position="absolute">{children}</Box>
    </DynamicColorCircle>
  );
}
