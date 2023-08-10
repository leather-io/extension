import { memo } from 'react';

import { PropsWithoutRefOrColor, Button as RadixButton, Text } from '@radix-ui/themes';

interface LButtonProps extends PropsWithoutRefOrColor<T> {
  children: React.ReactNode;
  isLoading?: boolean;
}
export const LButton = memo((props: LButtonProps) => {
  const { children, isLoading, ...rest } = props;

  return (
    <RadixButton
      color="gray"
      variant="solid"
      highContrast
      size="3"
      {...rest}
    >
      {isLoading ? <Text>Loading...</Text> : children}
    </RadixButton>
  );
});
