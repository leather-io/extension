import { Text } from "@app/components/typography";
import { Flex } from "@stacks/ui";

export function Swap() {
  return (
    <Flex
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
