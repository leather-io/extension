import { Flex, FlexProps } from '@stacks/ui';

export function NetworkListLayout({ children, ...props }: FlexProps) {
  return (
    <Flex flexWrap="wrap" flexDirection="column" {...props}>
      {children}
    </Flex>
  );
}
