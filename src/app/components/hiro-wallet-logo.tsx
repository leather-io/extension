import { memo } from 'react';
import { Stack, StackProps, color } from '@stacks/ui';

import { HiroIcon } from './icons/hiro-icon';
import { HiroWalletText } from './icons/hiro-wallet-text';

export const HiroWalletLogo = memo((props: StackProps) => {
  return (
    <Stack
      _hover={{ color: color('brand') }}
      alignItems="center"
      color={color('text-title')}
      cursor="pointer"
      flexDirection="row"
      isInline
      {...props}
    >
      <HiroIcon width="28px" height="20px" />
      <HiroWalletText width="82px" height="14px" />
    </Stack>
  );
});
