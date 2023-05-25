import { Box, Button, Stack, color } from '@stacks/ui';

import { PrimaryButton } from '@app/components/primary-button';

interface BitcoinContractRequestActionsProps {
  isLoading: boolean;
  onReject(): Promise<void>;
  onAcceptBitcoinContractOffer(): Promise<void>;
}
export function BitcoinContractRequestActions({ isLoading, onReject, onAcceptBitcoinContractOffer }: BitcoinContractRequestActionsProps) {
  return (
    <Box
      bg={color('bg')}
      borderTop="1px solid #DCDDE2"
      bottom="0px"
      height="96px"
      position="absolute"
      px="loose"
      width="100%"
      zIndex={999}
    >
      <Stack isInline mt="loose" spacing="base">
        <Button borderRadius="10px" flexGrow={1} mode="tertiary" onClick={onReject}>
          Reject
        </Button>
        <PrimaryButton borderRadius="10px" flexGrow={1} isLoading={isLoading} onClick={onAcceptBitcoinContractOffer}>
          Accept
        </PrimaryButton>
      </Stack>
    </Box>
  );
}
