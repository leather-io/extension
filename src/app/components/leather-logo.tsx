import { memo } from 'react';

import { styled } from 'leather-styles/jsx';

import { LogomarkIcon } from '@app/ui/icons/logomark-icon';

interface LeatherLogoProps {
  onClick?(): void;
}
export const LeatherLogo = memo((props: LeatherLogoProps) => {
  const { onClick } = props;

  return (
    <styled.button
      _hover={{ color: 'ink.action-primary-hover' }}
      color="ink.text-primary"
      onClick={onClick}
      type="button"
    >
      <LogomarkIcon />
    </styled.button>
  );
});
