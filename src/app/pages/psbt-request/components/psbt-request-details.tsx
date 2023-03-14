import { Box, Stack, color } from '@stacks/ui';

import { PsbtRequestHexDrawer } from './psbt-request-hex-drawer';

interface PsbtRequestDetailsProps {
  details: any;
  payloadTxHex: string;
}
export function PsbtRequestDetails({ details, payloadTxHex }: PsbtRequestDetailsProps) {
  return (
    <Box minHeight="260px">
      <Stack
        backgroundColor={color('border')}
        border="4px solid"
        borderColor={color('border')}
        borderRadius="20px"
        paddingBottom="tight"
      >
        <Box background="white" borderRadius="16px" overflowX="scroll" py="loose">
          <Box fontSize="14px" lineHeight="1.7" px="loose">
            <pre>
              {JSON.stringify(
                details,
                (_, value) => (typeof value === 'bigint' ? value.toString() : value),
                2
              )}
            </pre>
          </Box>
        </Box>
        {payloadTxHex ? <PsbtRequestHexDrawer hex={payloadTxHex} /> : null}
      </Stack>
    </Box>
  );
}
