import { Navigate, useParams } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';
import { isString } from '@shared/utils';

import { SendCryptoAssetFormLayout } from './components/send-crypto-asset-form.layout';
import { BtcSendForm } from './form/btc/btc-send-form';
import { StacksSip10FungibleTokenSendForm } from './form/stacks-sip10/stacks-sip10-fungible-token-send-form';
import { StxSendForm } from './form/stx/stx-send-form';

export function SendCryptoAssetForm() {
  const { symbol } = useParams();

  if (!isString(symbol)) {
    return <Navigate to={RouteUrls.SendCryptoAsset} />;
  }

  const content = (() => {
    switch (symbol) {
      case 'btc':
        return <BtcSendForm />;

      case 'stx':
        return <StxSendForm />;

      // Currently the only other currencies we support are Stacks SIP-10 FTs. This
      // routing logic will need to be updated on addition of new chain tokens
      default:
        return <StacksSip10FungibleTokenSendForm symbol={symbol} />;
    }
  })();

  return <SendCryptoAssetFormLayout>{content}</SendCryptoAssetFormLayout>;
}
