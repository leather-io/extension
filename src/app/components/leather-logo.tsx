import { memo } from 'react';

import { HStack, HstackProps } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { LeatherIcon } from './icons/leather-icon';

interface LeatherLogoProps extends HstackProps {
  isClickable: boolean;
}
export const LeatherLogo = memo((props: LeatherLogoProps) => {
  const { isClickable, ...rest } = props;

  return (
    <HStack
      _hover={{ color: token('colors.brown.11') }}
      alignItems="center"
      color={token('colors.accent.action-primary-default')}
      cursor={isClickable ? 'pointer' : 'unset'}
      {...rest}
    >
      <LeatherIcon />
    </HStack>
  );
});
