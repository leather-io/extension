import { BitcoinNativeSegwitAccountLoader } from '@app/components/loaders/bitcoin-account-loader';
import { BtcCryptoAssetLoader } from '@app/components/loaders/btc-crypto-asset-loader';

import { BtcSendFormContainer } from './btc-send-form-container';

export function BtcSendForm() {
  return (
    <BitcoinNativeSegwitAccountLoader current>
      {signer => (
        <BtcCryptoAssetLoader address={signer.address}>
          {token => (
            <BtcSendFormContainer
              assetInfo={token.assetInfo}
              balance={token.balance}
              marketData={token.marketData}
            />
          )}
        </BtcCryptoAssetLoader>
      )}
    </BitcoinNativeSegwitAccountLoader>
  );
}
