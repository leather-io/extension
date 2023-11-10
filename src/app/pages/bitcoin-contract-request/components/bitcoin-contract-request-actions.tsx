import { BitcoinContractRequestSelectors } from '@tests/selectors/bitcoin-contract-request.selectors';
import { Box, HStack, styled } from 'leather-styles/jsx';

import { useBtcAssetBalance } from '@app/common/hooks/balance/btc/use-btc-balance';
import { LeatherButton } from '@app/components/button/button';

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
      // TODO #4476 check this border colour it was DCDDE2
      // - can we pass it with shorthand?
      borderTop="1px solid"
      borderColor="border-default"
      bottom="0px"
      height="96px"
      position="fixed"
      px="space.05"
      width="100%"
      zIndex={999}
    >
      <HStack mt="space.05" gap="space.04">
        <styled.button
          borderRadius="10px"
          flexGrow={1}
          // TODO check this button style
          // mode="tertiary"
          data-testid={BitcoinContractRequestSelectors.BitcoinContractRejectButton}
          onClick={onRejectBitcoinContractOffer}
        >
          Reject
        </styled.button>
        <LeatherButton
          borderRadius="10px"
          flexGrow={1}
          aria-busy={isLoading}
          disabled={!canAccept}
          data-testid={BitcoinContractRequestSelectors.BitcoinContractAcceptButton}
          onClick={onAcceptBitcoinContractOffer}
        >
          Accept
        </LeatherButton>
      </HStack>
    </Box>
  );
}
