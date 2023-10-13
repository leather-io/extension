import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { Header } from '@app/components/header';
import { FullPageLoadingSpinner } from '@app/components/loading-spinner';
import { useCurrentStacksAccountAnchoredBalances } from '@app/query/stacks/balance/stx-balance.hooks';
import { ModalBackgroundWrapper } from '@app/routes/components/modal-background-wrapper';
import { useBackgroundLocationRedirect } from '@app/routes/hooks/use-background-location-redirect';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { FundLayout } from './fund.layout';

interface FundPageProps {
  children: React.ReactNode;
}
export function FundPage({ children }: FundPageProps) {
  useBackgroundLocationRedirect(RouteUrls.Fund);
  const navigate = useNavigate();
  const currentAccount = useCurrentStacksAccount();
  const { data: balances } = useCurrentStacksAccountAnchoredBalances();

  useRouteHeader(<Header onClose={() => navigate(RouteUrls.Home)} title=" " />);

  if (!currentAccount || !balances) return <FullPageLoadingSpinner />;
  return (
    <>
      <FundLayout address={currentAccount.address} />
      <>
        <ModalBackgroundWrapper>{children}</ModalBackgroundWrapper>
      </>
    </>
  );
}
