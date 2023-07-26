import { Text } from "@app/components/typography";
import { Flex } from "@stacks/ui";
import { SwapCryptoAssetSelectors } from "@tests/selectors/swap.selectors";

export function Swap() {
  return (
    <Flex
      data-testid={SwapCryptoAssetSelectors.SwapPageReady}
      alignItems={['left', 'center']}
      maxHeight={['unset', '85vh']}
      flexDirection="column"
      justifyContent="start"
      overflowY="auto"
      flexGrow={1}
    >
      <Text marginTop="15px" marginBottom="15px">Coming soon!</Text>
    </Flex>
  );
}
