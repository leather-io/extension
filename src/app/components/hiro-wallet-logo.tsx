import { memo } from 'react';
import { Stack, StackProps, color } from '@stacks/ui';

import { HiroIcon } from './icons/hiro-icon';
import { HiroWalletText } from './icons/hiro-wallet-text';

interface HiroWalletLogoProps extends StackProps {
  isClickable: boolean;
}
export const HiroWalletLogo = memo((props: HiroWalletLogoProps) => {
  const { isClickable, ...rest } = props;

  return (
    <Stack
      _hover={{ color: color('brand') }}
      alignItems="center"
      color={color('text-title')}
      cursor={isClickable ? 'pointer' : 'unset'}
      isInline
      {...rest}
    >
      <HiroIcon width="28px" height="20px" />
      <HiroWalletText width="82px" height="14px" />
    </Stack>
  );
});
