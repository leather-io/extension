import { Box, Stack, color } from '@stacks/ui';

import { PsbtRequestDisplayer } from './psbt-request-displayer';
import { PsbtRequestHexDrawer } from './psbt-request-hex-drawer';

// TODO: In progress for v2 - rename
// ts-unused-exports:disable-next-line
export function PsbtRequestDetailsV2(props: { details?: object; payloadTxHex: string }) {
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
            <PsbtRequestDisplayer details={details} />
          </Box>
        </Box>
        {payloadTxHex ? <PsbtRequestHexDrawer hex={payloadTxHex} /> : null}
      </Stack>
    </Box>
  );
}
