import { Caption } from '@leather.io/ui';

import { formatCurrency } from '@app/common/currency-formatter';
import { PrivateText } from '@app/components/privacy/private-text';
import { useCurrentNativeSegwitBtcBalanceWithFallback } from '@app/query/bitcoin/balance/btc-balance.hooks';

export function BtcBalance() {
  const balance = useCurrentNativeSegwitBtcBalanceWithFallback();

  return (
    <Caption>
      <PrivateText canClickToShow>{formatCurrency(balance.btc.availableBalance)}</PrivateText>
    </Caption>
  );
}
