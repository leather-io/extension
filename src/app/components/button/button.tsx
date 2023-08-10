import { memo } from 'react';

import { GetPropDefTypes, Button as RadixButton, Text, buttonPropDefs } from '@radix-ui/themes';

interface LButtonProps extends GetPropDefTypes<typeof buttonPropDefs> {
  asChild?: boolean;
  children: React.ReactNode;
  isLoading?: boolean;
}
export const LButton = memo((props: LButtonProps) => {
  const { children, isLoading, ...rest } = props;

  return (
    <RadixButton style={{ flex: '1 1 0' }} {...rest}>
      {isLoading ? <Text>Loading...</Text> : children}
    </RadixButton>
  );
});
