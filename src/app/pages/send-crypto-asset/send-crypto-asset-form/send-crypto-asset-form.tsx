import { useParams } from 'react-router-dom';

import { BitcoinCryptoCurrencySendForm } from './bitcoin/bitcoin-crypto-currency-send-form';
import { StacksCryptoCurrencySendForm } from './stacks/stacks-crypto-currency-send-form';
import { StacksFungibleTokenSendForm } from './stacks/stacks-fungible-token-send-form';

// TODO: These can all be different forms rendering shared components
export function SendCryptoAssetForm() {
  const { symbol } = useParams();

  switch (symbol) {
    case 'btc':
      return <BitcoinCryptoCurrencySendForm />;

    case 'stx':
      return <StacksCryptoCurrencySendForm />;

    // Currently the only other currencies we support are Stacks FTs. This
    // routing logic will need to be updated on addition of new chain tokens
    default:
      return <StacksFungibleTokenSendForm />;
  }
}
