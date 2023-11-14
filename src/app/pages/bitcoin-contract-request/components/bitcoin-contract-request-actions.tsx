import { BitcoinContractRequestSelectors } from '@tests/selectors/bitcoin-contract-request.selectors';
import { Box, HStack, styled } from 'leather-styles/jsx';

import { useBtcAssetBalance } from '@app/common/hooks/balance/btc/use-btc-balance';
import { LeatherButton } from '@app/ui/components/button';

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
        <LeatherButton
          data-testid={BitcoinContractRequestSelectors.BitcoinContractRejectButton}
          flexGrow={1}
          onClick={onRejectBitcoinContractOffer}
          variant="outline"
        >
          Reject
        </LeatherButton>
        <LeatherButton
          aria-busy={isLoading}
          data-testid={BitcoinContractRequestSelectors.BitcoinContractAcceptButton}
          flexGrow={1}
          disabled={!canAccept}
          onClick={onAcceptBitcoinContractOffer}
        >
          Accept
        </LeatherButton>
      </HStack>
    </Box>
  );
}
