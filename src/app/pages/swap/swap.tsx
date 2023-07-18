import { Text } from "@app/components/typography";
import { Flex } from "@stacks/ui";

export function Swap() {
  return (
    <Flex
      alignItems={['left', 'center']}
      flexGrow={1}
      flexDirection="column"
      justifyContent="start"
      maxHeight={['unset', '85vh']}
      overflowY="auto"
    >
      <Text>Hello world!</Text>
    </Flex>
  );
}
