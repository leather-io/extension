import { useNavigate } from 'react-router-dom';

import { useCurrentAccount } from '@app/store/accounts/account.hooks';
import { RouteUrls } from '@shared/route-urls';

import { BuyLayout } from './buy.layout';
import { OnrampProviders } from './components/onramp-provider';

export const BuyPage = () => {
  const navigate = useNavigate();
  const currentAccount = useCurrentAccount();
  if (!currentAccount) return null;

  return (
    <BuyLayout
      onCloseAction={() => navigate(RouteUrls.Home)}
      onrampProviders={<OnrampProviders address={currentAccount.address} />}
    />
  );
};
