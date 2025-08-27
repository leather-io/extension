import { Caption } from '@leather.io/ui';

import { formatCurrency } from '@app/common/currency-formatter';
import { BitcoinNativeSegwitAccountLoader } from '@app/components/loaders/bitcoin-account-loader';
import { BtcBalanceLoader } from '@app/components/loaders/btc-balance-loader';
import { PrivateText } from '@app/components/privacy/private-text';

export function BtcBalance() {
  return (
    <BitcoinNativeSegwitAccountLoader current>
      {signer => (
        <BtcBalanceLoader address={signer.address}>
          {balance => (
            <Caption>
              <PrivateText canClickToShow>{formatCurrency(balance.availableBalance)}</PrivateText>
            </Caption>
          )}
        </BtcBalanceLoader>
      )}
    </BitcoinNativeSegwitAccountLoader>
  );
}
