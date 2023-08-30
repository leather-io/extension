import { memo } from 'react';

import { ButtonProps, Text } from '@stacks/ui';

interface HomeActionButtonProps extends ButtonProps {
  label: string;
  buttonComponent(props: ButtonProps): React.JSX.Element;
}
export const HomeActionButton = memo((props: HomeActionButtonProps) => {
  const { label, buttonComponent: Button, ...rest } = props;

  return (
    <Button height="36px" minWidth="80px" px="base-tight" py="tight" position="relative" {...rest}>
      <Text fontSize="14px">{label}</Text>
    </Button>
  );
});
