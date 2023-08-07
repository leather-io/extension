import { memo } from 'react';

import { Box, ButtonProps, Text } from '@stacks/ui';

interface HomeActionButtonProps extends ButtonProps {
  icon: any;
  label: string;
  buttonComponent(props: ButtonProps): React.JSX.Element;
}
export const HomeActionButton = memo((props: HomeActionButtonProps) => {
  const { icon, label, buttonComponent: Button, ...rest } = props;

  return (
    <Button height="36px" px="base-tight" py="tight" position="relative" {...rest}>
      <Box as={icon} mr="tight" size="14px" />
      <Text fontSize="14px">{label}</Text>
    </Button>
  );
});
