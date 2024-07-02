import { Caption } from '@leather.io/ui';
import { formatMoney } from '@leather.io/utils';

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
