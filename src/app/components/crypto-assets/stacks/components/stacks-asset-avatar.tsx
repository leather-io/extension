import { Box, BoxProps } from 'leather-styles/jsx';

import { DynamicColorCircle } from '@app/ui/components/dynamic-color-circle';

import { StacksUnanchoredStatusIcon } from './stacks-unanchored-status-icon';
import { StxAvatar } from './stx-avatar';

interface StacksAssetAvatarProps extends BoxProps {
  gradientString?: string;
  imageCanonicalUri?: string;
  isStx?: boolean;
  isUnanchored?: boolean;
  size?: string;
}
export function StacksAssetAvatar({
  children,
  gradientString,
  imageCanonicalUri,
  isStx,
  isUnanchored,
  size = '36',
  ...props
}: StacksAssetAvatarProps) {
  if (isStx) return <StxAvatar />;

  const { color } = props;

  if (imageCanonicalUri)
    return <img height={`${size}px`} width={`${size}px`} src={encodeURI(imageCanonicalUri)} />;

  if (!gradientString) return null;

  return (
    <DynamicColorCircle color={color} size={size} value={gradientString}>
      <Box position="absolute">{children}</Box>
      {isUnanchored ? <StacksUnanchoredStatusIcon /> : null}
    </DynamicColorCircle>
  );
}
