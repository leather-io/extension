import { memo } from 'react';

import { Button as RadixButton, Text } from '@radix-ui/themes';

// import { ButtonProps } from '@stacks/ui';

interface HomeActionButtonProps extends any {
  icon: any;
  label: string;
  buttonComponent(props: any): React.JSX.Element;
}
export const HomeActionButton = memo((props: HomeActionButtonProps) => {
  const { icon, label, buttonComponent: Button, ...rest } = props;

  return (
    // <Button height="36px" px="base-tight" py="tight" position="relative" {...rest}>
    //   <Box as={icon} mr="tight" size="14px" />
    //   <Text fontSize="14px">{label}</Text>
    // </Button>
    <RadixButton color="brown" size="3">
      {/* <IconButton>{icon}</IconButton> */}
      {/* <Box as={icon} mr="tight" size="14px" /> */}
      <Text color="red">{label}</Text>
    </RadixButton>
  );
});
