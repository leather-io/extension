import { Flex, StackProps } from 'leather-styles/jsx';
import { Box, styled } from 'leather-styles/jsx';

export function ChooseCryptoAssetLayout({ children }: StackProps) {
  return (
    <Flex
      alignItems="left"
      flexGrow={1}
      flexDirection="column"
      justifyContent="start"
      maxHeight={['unset', '85vh']}
      overflowY="auto"
    >
      <Box pb="space.05" pt={['unset', 'space.05']} px="space.05">
        <styled.h1 textStyle="heading.03">
          CHOOSE ASSET
          <br />
          TO SEND
        </styled.h1>
      </Box>
      {children}
    </Flex>
  );
}
