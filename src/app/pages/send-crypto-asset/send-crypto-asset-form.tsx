import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';
import { isString } from '@shared/utils';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { Header } from '@app/components/header';

import { SendCryptoAssetLayout } from './components/send-crypto-asset.layout';
import { BitcoinCryptoCurrencySendForm } from './forms/btc/btc-crypto-currency-send-form';
import { StacksFungibleTokenSendForm } from './forms/stx-sip10/stacks-fungible-token-send-form';
import { StacksCryptoCurrencySendForm } from './forms/stx/stx-crypto-currency-send-form';

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
        return <BitcoinCryptoCurrencySendForm />;

      case 'stx':
        return <StacksCryptoCurrencySendForm />;

      // Currently the only other currencies we support are Stacks SIP-10 FTs. This
      // routing logic will need to be updated on addition of new chain tokens
      default:
        return <StacksFungibleTokenSendForm symbol={symbol} />;
    }
  })();

  return <SendCryptoAssetLayout>{content}</SendCryptoAssetLayout>;
}
