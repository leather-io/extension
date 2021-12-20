import { StxIcon } from '@app/components/icons/stx-icon';
import { MicroblockIcon } from '@app/components/icons/microblock';
import { BoxProps, Circle, color, DynamicColorCircle } from '@stacks/ui';
import { TypeIconWrapper } from '@app/components/tx-icon';

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
const StxAvatar = (props: StxAvatarProps) => {
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
export const AssetAvatar = ({
  useStx,
  isUnanchored,
  gradientString,
  children,
  ...props
}: AssetProps) => {
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
