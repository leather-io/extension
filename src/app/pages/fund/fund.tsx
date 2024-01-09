import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { isCryptoCurrency } from '@shared/models/currencies.model';
import { RouteUrls } from '@shared/route-urls';

import { useBtcCryptoCurrencyAssetBalance } from '@app/common/hooks/balance/btc/use-btc-crypto-currency-asset-balance';
import { useStxCryptoCurrencyAssetBalance } from '@app/common/hooks/balance/stx/use-stx-crypto-currency-asset-balance';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { Header } from '@app/components/header';
import { FullPageLoadingSpinner } from '@app/components/loading-spinner';
import { useCurrentAccountNativeSegwitIndexZeroSignerNullable } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { FundLayout } from './components/fund.layout';
import { FiatProvidersList } from './fiat-providers-list';

export function FundPage() {
  const navigate = useNavigate();
  const currentStxAccount = useCurrentStacksAccount();
  const bitcoinSigner = useCurrentAccountNativeSegwitIndexZeroSignerNullable();
  const btcCryptoCurrencyAssetBalance = useBtcCryptoCurrencyAssetBalance();
  const stxCryptoCurrencyAssetBalance = useStxCryptoCurrencyAssetBalance();
  const { currency } = useParams();

  function getSymbol() {
    if (isCryptoCurrency(currency)) {
      return currency;
    }
    return 'STX';
  }
  function getAddress() {
    switch (symbol) {
      case 'BTC':
        return bitcoinSigner?.address;
      case 'STX':
        return currentStxAccount?.address;
    }
  }
  function getBalance() {
    switch (symbol) {
      case 'BTC':
        return btcCryptoCurrencyAssetBalance;
      case 'STX':
        return stxCryptoCurrencyAssetBalance;
    }
  }

  const symbol = getSymbol();
  const address = getAddress();
  const balance = getBalance();

  useRouteHeader(<Header onClose={() => navigate(RouteUrls.FundChooseCurrency)} title=" " />);

  if (!address || !balance) return <FullPageLoadingSpinner />;
  return (
    <>
      <FundLayout symbol={symbol}>
        <FiatProvidersList address={address} symbol={symbol} />
      </FundLayout>
      <Outlet />
    </>
  );
}
