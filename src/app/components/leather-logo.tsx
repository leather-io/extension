import { memo } from 'react';

import { LeatherIcon } from '@app/ui/components/icons/leather-icon';

import { LeatherButton } from './button/button';

interface LeatherLogoProps {
  isClickable: boolean;
  onClick?(): void;
}
export const LeatherLogo = memo((props: LeatherLogoProps) => {
  const { isClickable, onClick } = props;

  return (
    <LeatherButton
      _hover={{ color: 'accent.action-primary-hover' }}
      color="accent.text-primary"
      cursor={isClickable ? 'pointer' : 'unset'}
      height="16px"
      onClick={onClick}
      variant="text"
      width="76px"
    >
      <LeatherIcon />
    </LeatherButton>
  );
});
