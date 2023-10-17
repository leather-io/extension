import { Box, BoxProps, Flex } from 'leather-styles/jsx';

export function LedgerWrapper({ children, ...props }: BoxProps) {
  return (
    <Box maxHeight="80vh" textAlign="center" px="space.07" {...props}>
      <Flex alignItems="center" flexDirection="column" pb="space.05">
        {children}
      </Flex>
    </Box>
  );
}
