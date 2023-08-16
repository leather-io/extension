import { memo } from 'react';

import { Stack, StackProps, color } from '@stacks/ui';
import { token } from 'leaf-styles/tokens';

import { LeatherIcon } from './icons/leather-icon';

interface HiroWalletLogoProps extends StackProps {
  isClickable: boolean;
}
export const HiroWalletLogo = memo((props: HiroWalletLogoProps) => {
  const { isClickable, ...rest } = props;

  return (
    <Stack
      _hover={{ color: token('colors.brown.11') }}
      alignItems="center"
      color={color('text-title')}
      cursor={isClickable ? 'pointer' : 'unset'}
      isInline
      {...rest}
    >
      <LeatherIcon />
    </Stack>
  );
});
