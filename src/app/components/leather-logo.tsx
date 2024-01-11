import { memo } from 'react';

import { styled } from 'leather-styles/jsx';

import { LeatherIcon } from '@app/ui/components/icons/leather-icon';

interface LeatherLogoProps {
  onClick?(): void;
}
export const LeatherLogo = memo((props: LeatherLogoProps) => {
  const { onClick } = props;

  return (
    <styled.button
      _hover={{ color: 'accent.action-primary-hover' }}
      color="accent.text-primary"
      height="16px"
      onClick={onClick}
      type="button"
      width="76px"
    >
      <LeatherIcon />
    </styled.button>
  );
});
