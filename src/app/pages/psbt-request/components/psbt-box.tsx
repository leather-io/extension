import { Box, Stack, color } from '@stacks/ui';

import { HexDrawer } from './hex-drawer';
import { PsbtDisplayer } from './psbt-displayer';

export function PsbtBox(props: { details?: object; payloadTxHex: string }) {
  const { details, payloadTxHex } = props;

  if (!details) return null;

  return (
    <Box minHeight="260px">
      <Stack
        backgroundColor={color('border')}
        border="4px solid"
        borderColor={color('border')}
        borderRadius="20px"
        paddingBottom={'8px'}
      >
        <Box background="white" borderRadius="16px" overflowX="scroll" py="loose">
          <Box fontSize="14px" lineHeight="1.7" px="loose">
            <PsbtDisplayer details={details} />
          </Box>
        </Box>
        {payloadTxHex ? <HexDrawer hex={payloadTxHex} /> : null}
      </Stack>
    </Box>
  );
}
