import React from 'react';
import { useChangeScreen } from '@common/hooks/use-change-screen';
import { useCurrentAccount } from '@store/accounts/account.hooks';
import { makeTransakUrl } from '@features/fiat-onramp-providers/transak-helper';
import { BuyLayout } from './buy.layout';
import { makeOkcoinUrl } from '@features/fiat-onramp-providers/okcoin-helper';
import { useActiveFiatProviders, useHasFiatProviders } from '@query/hiro-config/hiro-config.query';
import { RouteUrls } from '@routes/route-urls';

export const BuyPage = () => {
  const changeScreen = useChangeScreen();
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
      onCloseAction={() => changeScreen(RouteUrls.PopupHome)}
      providersUrl={providersUrl}
      activeProviders={activeProviders}
    />
  );
};
