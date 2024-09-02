import { Caption } from '@leather.io/ui';
import { formatMoney } from '@leather.io/utils';

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
              <PrivateText canClickToShow>{formatMoney(balance.availableBalance)}</PrivateText>
            </Caption>
          )}
        </BtcBalanceLoader>
      )}
    </BitcoinNativeSegwitAccountLoader>
  );
}
