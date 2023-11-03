import { Flex, FlexProps } from 'leather-styles/jsx';

export function NetworkListLayout({ children, ...props }: FlexProps) {
  return (
    <Flex flexWrap="wrap" flexDirection="column" {...props}>
      {children}
    </Flex>
  );
}
