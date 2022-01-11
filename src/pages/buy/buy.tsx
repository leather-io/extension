import { useNavigate } from 'react-router-dom';

import { useCurrentAccount } from '@store/accounts/account.hooks';
import { makeTransakUrl } from '@features/fiat-onramp-providers/transak-helper';
import { makeOkcoinUrl } from '@features/fiat-onramp-providers/okcoin-helper';
import { useActiveFiatProviders, useHasFiatProviders } from '@query/hiro-config/hiro-config.query';
import { RouteUrls } from '@routes/route-urls';

import { BuyLayout } from './buy.layout';

export const BuyPage = () => {
  const navigate = useNavigate();
  const currentAccount = useCurrentAccount();
  const activeProviders = useActiveFiatProviders();
  const hasProviders = useHasFiatProviders();
  if (!hasProviders || !currentAccount) return null;

  const providersUrl = {
    transak: makeTransakUrl(currentAccount.address),
    okcoin: makeOkcoinUrl(currentAccount.address),
  };

  return (
    <BuyLayout
      onCloseAction={() => navigate(RouteUrls.Home)}
      providersUrl={providersUrl}
      activeProviders={activeProviders}
    />
  );
};
