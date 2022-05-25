import { BoxProps, Circle, color, DynamicColorCircle } from '@stacks/ui';

import { StxIcon } from '@app/components/icons/stx-icon';
import { MicroblockIcon } from '@app/components/icons/microblock';

import { TransactionTypeIconWrapper } from './transaction/components/transaction-type-icon-wrapper';

const microIcon = () => (
  <MicroblockIcon
    size="13px"
    fill={color('bg')}
    borderColor={color('invert')}
    bg={color('accent')}
  />
);

const iconItem = (isUnanchored = false) =>
  isUnanchored ? <TransactionTypeIconWrapper icon={microIcon} bg="invert" /> : null;

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
  imageCanonicalUri?: string;
}
export const AssetAvatar = ({
  useStx,
  isUnanchored,
  gradientString,
  children,
  imageCanonicalUri,
  ...props
}: AssetProps) => {
  if (useStx) {
    return <StxAvatar {...props} />;
  }
  const { size } = props;
  const imageDimension = (size && +size) || '36px';
  if (imageCanonicalUri)
    return (
      <img width={imageDimension} height={imageDimension} src={encodeURI(imageCanonicalUri)} />
    );
  return (
    <DynamicColorCircle {...props} string={gradientString}>
      {children}
      {iconItem(isUnanchored)}
    </DynamicColorCircle>
  );
};
