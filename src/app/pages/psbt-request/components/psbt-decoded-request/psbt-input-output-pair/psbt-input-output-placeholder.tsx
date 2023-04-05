import { Box, Text } from '@stacks/ui';

import { PsbtDecodedNodeLayout } from './psbt-decoded-node.layout';

export function PsbtInputOutputPlaceholder() {
  return (
    <Box background="white" borderRadius="16px" p="loose">
      <Text fontWeight={500}>Inputs</Text>
      <PsbtDecodedNodeLayout value="No inputs will be spent" />
      <hr />
      <Text fontWeight={500} mt="loose">
        Outputs
      </Text>
      <PsbtDecodedNodeLayout value="No outputs will transfer" />
    </Box>
  );
}
