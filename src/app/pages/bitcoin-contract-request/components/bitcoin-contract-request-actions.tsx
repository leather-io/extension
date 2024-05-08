import { BitcoinContractRequestSelectors } from '@tests/selectors/bitcoin-contract-request.selectors';

import { useNativeSegwitBtcCryptoAssetBalance } from '@app/query/bitcoin/balance/btc-native-segwit-balance.hooks';
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
  const { btcCryptoAssetBalance } = useNativeSegwitBtcCryptoAssetBalance(bitcoinAddress);
  const canAccept = btcCryptoAssetBalance.availableBalance.amount.isGreaterThan(requiredAmount);

  return (
    <>
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
    </>
  );
}
