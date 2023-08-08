import { memo } from 'react';

import { ButtonProps } from '@stacks/ui';

import { MantineButton } from '@app/components/button/Button';

interface HomeActionButtonProps extends ButtonProps {
  icon: any;
  label: string;
}
export const HomeActionButton = memo((props: HomeActionButtonProps) => {
  const { icon, label } = props;

  return <MantineButton icon={icon} label={label} />;
});
