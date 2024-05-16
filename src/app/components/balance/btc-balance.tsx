import { formatMoney } from '@app/common/money/format-money';
import { Caption } from '@app/ui/components/typography/caption';

import { BitcoinNativeSegwitAccountLoader } from '../loaders/bitcoin-account-loader';
import { BtcBalanceLoader } from '../loaders/btc-balance-loader';

export function BtcBalance() {
  return (
    <BitcoinNativeSegwitAccountLoader current>
      {signer => (
        <BtcBalanceLoader address={signer.address}>
          {balance => <Caption>{formatMoney(balance.availableBalance)}</Caption>}
        </BtcBalanceLoader>
      )}
    </BitcoinNativeSegwitAccountLoader>
  );
}
