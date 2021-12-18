import * as React from 'react';
import { StxIcon } from '@components/icons/stx-icon';
import { MicroblockIcon } from '@components/icons/microblock';
import { BoxProps, Circle, color, DynamicColorCircle } from '@stacks/ui';
import { TypeIconWrapper } from '@components/tx-icon';

const microIcon = () => (
  <MicroblockIcon
    size="13px"
    fill={color('bg')}
    borderColor={color('invert')}
    bg={color('accent')}
  />
);

const iconItem = (isUnanchored = false) =>
  isUnanchored ? <TypeIconWrapper icon={microIcon} bg="invert" /> : null;

interface StxAvatarProps extends BoxProps {
  isUnanchored?: boolean;
}
const StxAvatar: React.FC<StxAvatarProps> = props => {
  return (
    <Circle position="relative" size="36px" bg={color('accent')} color={color('bg')} {...props}>
      <StxIcon />
      {iconItem(props.isUnanchored)}
    </Circle>
  );
};

interface AssetProps extends BoxProps {
  gradientString: string;
  useStx: boolean;
  isUnanchored?: boolean;
}

export const AssetAvatar: React.FC<AssetProps> = ({
  useStx,
  isUnanchored,
  gradientString,
  children,
  ...props
}) => {
  if (useStx) {
    return <StxAvatar {...props} />;
  }
  return (
    <DynamicColorCircle {...props} string={gradientString}>
      {children}
      {iconItem(isUnanchored)}
    </DynamicColorCircle>
  );
};
