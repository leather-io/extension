import { Box, Flex, StackProps, styled } from 'leather-styles/jsx';

export function ChooseCryptoAssetLayout({ children, title }: StackProps & { title: string }) {
  return (
    <Flex
      alignItems="left"
      flexGrow={1}
      flexDirection="column"
      justifyContent="start"
      maxHeight={['unset', '85vh']}
      overflowY="auto"
      pb="space.05"
    >
      <Box pb="space.05" pt={['unset', 'space.05']} px="space.05">
        <styled.h1 width="250px" textStyle="heading.03">
          {title}
        </styled.h1>
      </Box>
      {children}
    </Flex>
  );
}
