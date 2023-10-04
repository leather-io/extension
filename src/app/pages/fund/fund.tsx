import { Outlet, useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { Header } from '@app/components/header';
import { FullPageLoadingSpinner } from '@app/components/loading-spinner';
import { useCurrentStacksAccountAnchoredBalances } from '@app/query/stacks/balance/stx-balance.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { FundLayout } from './fund.layout';

export function FundPage() {
  const navigate = useNavigate();

  const currentAccount = useCurrentStacksAccount();
  const { data: balances } = useCurrentStacksAccountAnchoredBalances();

  useRouteHeader(<Header onClose={() => navigate(RouteUrls.Home)} title=" " />);

  if (!currentAccount || !balances) return <FullPageLoadingSpinner />;
  return (
    <>
      <FundLayout address={currentAccount.address} />
      <Outlet />
    </>
  );
}
