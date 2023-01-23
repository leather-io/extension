import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';
import { isString } from '@shared/utils';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { Header } from '@app/components/header';

<<<<<<< HEAD
import { SendCryptoAssetFormLayout } from './_components/send-crypto-asset-form.layout';
import { BtcCryptoCurrencySendForm } from './btc/btc-crypto-currency-send-form';
import { StacksSip10FungibleTokenSendForm } from './stacks-sip10/stacks-sip10-fungible-token-send-form';
import { StxCryptoCurrencySendForm } from './stx/stx-crypto-currency-send-form';
||||||| d62440114
import { SendCryptoAssetLayout } from './components/send-crypto-asset.layout';
import { BitcoinCryptoCurrencySendForm } from './forms/btc/btc-crypto-currency-send-form';
import { StacksFungibleTokenSendForm } from './forms/stx-sip10/stacks-fungible-token-send-form';
import { StacksCryptoCurrencySendForm } from './forms/stx/stx-crypto-currency-send-form';
=======
import { ChooseCryptoAssetLayout } from './components/send-crypto-asset.layout';
import { BtcCryptoCurrencySendForm } from './forms/btc/btc-crypto-currency-send-form';
import { StacksFungibleTokenSendForm } from './forms/stx-sip10/stacks-fungible-token-send-form';
import { StxCryptoCurrencySendForm } from './forms/stx/stx-crypto-currency-send-form';
>>>>>>> origin/main

export function SendCryptoAssetForm() {
  const { symbol } = useParams();
  const navigate = useNavigate();

  useRouteHeader(
    <Header hideActions onClose={() => navigate(RouteUrls.SendCryptoAsset)} title="Send" />
  );

  if (!isString(symbol)) {
    return <Navigate to={RouteUrls.SendCryptoAsset} />;
  }

  const content = (() => {
    switch (symbol) {
      case 'btc':
        return <BtcCryptoCurrencySendForm />;

      case 'stx':
        return <StxCryptoCurrencySendForm />;

      // Currently the only other currencies we support are Stacks SIP-10 FTs. This
      // routing logic will need to be updated on addition of new chain tokens
      default:
        return <StacksSip10FungibleTokenSendForm symbol={symbol} />;
    }
  })();

<<<<<<< HEAD
  return <SendCryptoAssetFormLayout>{content}</SendCryptoAssetFormLayout>;
||||||| d62440114
  return <SendCryptoAssetLayout>{content}</SendCryptoAssetLayout>;
=======
  return <ChooseCryptoAssetLayout>{content}</ChooseCryptoAssetLayout>;
>>>>>>> origin/main
}
