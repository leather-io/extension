// #4164 FIXME migrate DynamicColorCircle
import { DynamicColorCircle } from '@stacks/ui';
import { BoxProps } from '@stacks/ui-core';

import { StacksUnanchoredStatusIcon } from './stacks-unanchored-status-icon';
import { StxAvatar } from './stx-avatar';

interface StacksAssetAvatarProps extends BoxProps {
  gradientString?: string;
  imageCanonicalUri?: string;
  isStx?: boolean;
  isUnanchored?: boolean;
}
export function StacksAssetAvatar({
  children,
  gradientString,
  imageCanonicalUri,
  isStx,
  isUnanchored,
  ...props
}: StacksAssetAvatarProps) {
  if (isStx) return <StxAvatar />;

  const { color, size } = props;
  const imageDimension = (size && +size) || '36px';

  if (imageCanonicalUri)
    return (
      <img height={imageDimension} width={imageDimension} src={encodeURI(imageCanonicalUri)} />
    );
  if (!gradientString) return null;

  return (
    <DynamicColorCircle color={color} size={imageDimension} string={gradientString}>
      {children}
      {isUnanchored ? <StacksUnanchoredStatusIcon /> : null}
    </DynamicColorCircle>
  );
}
