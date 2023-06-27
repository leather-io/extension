import { Box, Button, Stack, color } from '@stacks/ui';

import { useBtcAssetBalance } from '@app/common/hooks/balance/btc/use-btc-balance';
import { PrimaryButton } from '@app/components/primary-button';

interface BitcoinContractRequestActionsProps {
  isLoading: boolean;
  bitcoinAddress: string;
  requiredAmount: number;
  onRejectBitcoinContractOffer(): Promise<void>;
  onAcceptBitcoinContractOffer(): Promise<void>;
}
export function BitcoinContractRequestActions({
  isLoading,
  bitcoinAddress,
  requiredAmount,
  onRejectBitcoinContractOffer,
  onAcceptBitcoinContractOffer,
}: BitcoinContractRequestActionsProps) {
  const { btcAvailableAssetBalance } = useBtcAssetBalance(bitcoinAddress);
  const canAccept = btcAvailableAssetBalance.balance.amount.isGreaterThan(requiredAmount);

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
        <Button
          borderRadius="10px"
          flexGrow={1}
          mode="tertiary"
          onClick={onRejectBitcoinContractOffer}
        >
          Reject
        </Button>
        <PrimaryButton
          borderRadius="10px"
          flexGrow={1}
          isLoading={isLoading}
          isDisabled={!canAccept}
          onClick={onAcceptBitcoinContractOffer}
        >
          Accept
        </PrimaryButton>
      </Stack>
    </Box>
  );
}
