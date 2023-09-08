import { Box, BoxProps, Flex } from 'leather-styles/jsx';

export function LedgerWrapper({ children, ...props }: BoxProps) {
  return (
    <Box maxHeight="80vh" textAlign="center" {...props}>
      <Flex alignItems="center" flexDirection="column" pb="space.05" px="space.05">
        {children}
      </Flex>
    </Box>
  );
}
