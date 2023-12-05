import { BitcoinContractRequestSelectors } from '@tests/selectors/bitcoin-contract-request.selectors';

import { useBtcAssetBalance } from '@app/common/hooks/balance/btc/use-btc-balance';
import { Button } from '@app/ui/components/button/button';
import { Footer } from '@app/ui/components/containers/footers/footer';

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
    <Footer flexDirection="row">
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
    </Footer>
  );
}
