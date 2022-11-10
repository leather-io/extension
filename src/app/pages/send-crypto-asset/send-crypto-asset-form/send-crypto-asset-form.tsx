import { useLocation } from 'react-router-dom';

import type { AllTransferableCryptoAssetBalances } from '@shared/models/crypto-asset-balance.model';

import { BitcoinCryptoCurrencySendForm } from './bitcoin/bitcoin-crypto-currency-send-form';
import { StacksCryptoCurrencySendForm } from './stacks/stacks-crypto-currency-send-form';
import { StacksFungibleTokenSendForm } from './stacks/stacks-fungible-token-send-form';

interface LocationStateProps {
  state: { assetBalance: AllTransferableCryptoAssetBalances };
}

// TODO: These can all be different forms rendering shared components
export function SendCryptoAssetForm() {
  const {
    state: { assetBalance },
  } = useLocation() as LocationStateProps;

  switch (assetBalance.blockchain) {
    case 'bitcoin':
      return <BitcoinCryptoCurrencySendForm />;
    case 'stacks':
      switch (assetBalance.type) {
        case 'crypto-currency':
          return <StacksCryptoCurrencySendForm assetBalance={assetBalance} />;
        case 'fungible-token':
          return <StacksFungibleTokenSendForm assetBalance={assetBalance} />;
        default:
          return null;
      }
    default:
      return null;
  }
}
