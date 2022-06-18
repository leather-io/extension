import { Box, BoxProps, Flex } from '@stacks/ui';

export function LedgerWrapper({ children, ...props }: BoxProps) {
  return (
    <Box maxHeight="80vh" textAlign="center" {...props}>
      <Flex alignItems="center" flexDirection="column" pb="loose" px="loose">
        {children}
      </Flex>
    </Box>
  );
}
