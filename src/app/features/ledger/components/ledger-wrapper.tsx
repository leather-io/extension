import { Box, BoxProps, Flex } from 'leather-styles/jsx';

interface LedgerWrapperProps extends BoxProps {
  image?: React.ReactNode;
}

export function LedgerWrapper({ image, children, ...props }: LedgerWrapperProps) {
  return (
    <Box maxHeight="80vh" px="space.05" textAlign="center" {...props}>
      <Flex alignItems="center" flexDirection="column" pb="space.05">
        {image && <Box mb="space.06">{image}</Box>}
        {children}
      </Flex>
    </Box>
  );
}
