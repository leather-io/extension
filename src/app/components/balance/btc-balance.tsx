import { formatMoney } from '@app/common/money/format-money';
import { Caption } from '@app/ui/components/typography/caption';

import { BitcoinNativeSegwitAccountLoader } from '../loaders/bitcoin-account-loader';
import { BtcCryptoAssetLoader } from '../loaders/btc-crypto-asset-loader';

export function BtcBalance() {
  return (
    <BitcoinNativeSegwitAccountLoader current>
      {signer => (
        <BtcCryptoAssetLoader address={signer.address}>
          {asset => <Caption>{formatMoney(asset.balance.availableBalance)}</Caption>}
        </BtcCryptoAssetLoader>
      )}
    </BitcoinNativeSegwitAccountLoader>
  );
}
