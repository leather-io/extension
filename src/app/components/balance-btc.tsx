import { formatMoney } from '@app/common/money/format-money';
import { Caption } from '@app/ui/components/typography/caption';

import { BitcoinNativeSegwitAccountLoader } from './account/bitcoin-account-loader';
import { BitcoinBalanceLoader } from './balance/bitcoin-balance-loader';

export function BtcBalance() {
  return (
    <BitcoinNativeSegwitAccountLoader current>
      {signer => (
        <BitcoinBalanceLoader address={signer.address}>
          {balance => <Caption>{formatMoney(balance.balance)}</Caption>}
        </BitcoinBalanceLoader>
      )}
    </BitcoinNativeSegwitAccountLoader>
  );
}
