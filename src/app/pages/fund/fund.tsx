import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { isCryptoCurrency } from '@shared/models/currencies.model';
import { RouteUrls } from '@shared/route-urls';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { Header } from '@app/components/header';
import { FullPageLoadingSpinner } from '@app/components/loading-spinner';
import { useCurrentStacksAccountAnchoredBalances } from '@app/query/stacks/balance/stx-balance.hooks';
import { useCurrentAccountNativeSegwitIndexZeroSignerNullable } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { FundLayout } from './components/fund.layout';
import { FiatProvidersList } from './fiat-providers-list';

export function FundPage() {
  const navigate = useNavigate();
  const currentStxAccount = useCurrentStacksAccount();
  const bitcoinSigner = useCurrentAccountNativeSegwitIndexZeroSignerNullable();
  const { data: balances } = useCurrentStacksAccountAnchoredBalances();
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

  const symbol = getSymbol();
  const address = getAddress();

  useRouteHeader(<Header onClose={() => navigate(RouteUrls.FundChooseCurrency)} title=" " />);

  if (!address || !balances) return <FullPageLoadingSpinner />;
  return (
    <>
      <FundLayout symbol={symbol}>
        <FiatProvidersList address={address} symbol={symbol} />
      </FundLayout>
      <Outlet />
    </>
  );
}
