import { BitcoinContractRequestSelectors } from '@tests/selectors/bitcoin-contract-request.selectors';
import { Box, HStack } from 'leather-styles/jsx';

import { useBtcAssetBalance } from '@app/common/hooks/balance/btc/use-btc-balance';
import { Button } from '@app/ui/components/button/button';

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
      bg="accent.background-primary"
      borderTop="default"
      bottom="0px"
      height="96px"
      position="fixed"
      px="space.05"
      width="100%"
      zIndex={999}
    >
      <HStack mt="space.05" gap="space.04">
        <Button
          data-testid={BitcoinContractRequestSelectors.BitcoinContractRejectButton}
          flexGrow={1}
          onClick={onRejectBitcoinContractOffer}
          variant="outline"
        >
          Reject
        </Button>
        <Button
          aria-busy={isLoading}
          data-testid={BitcoinContractRequestSelectors.BitcoinContractAcceptButton}
          flexGrow={1}
          disabled={!canAccept}
          onClick={onAcceptBitcoinContractOffer}
        >
          Accept
        </Button>
      </HStack>
    </Box>
  );
}
