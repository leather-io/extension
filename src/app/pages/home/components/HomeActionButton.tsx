import { memo } from 'react';

import { MantineButton } from '@app/components/button/Button';

interface HomeActionButtonProps {
  icon: any;
  isDisabled?: boolean;
  label: string;
  onClick?: () => void;
}
export const HomeActionButton = memo(
  ({ isDisabled = false, icon, label, onClick }: HomeActionButtonProps) => (
    <MantineButton
      disabled={isDisabled}
      icon={icon}
      label={label}
      onClick={() => onClick && onClick()}
    />
  )
);
