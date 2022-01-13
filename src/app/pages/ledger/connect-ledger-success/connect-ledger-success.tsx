import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { ConnectLedgerSuccessLayout } from './connect-ledger-success.layout';
import { useEffect } from 'react';

export const ConnectLedgerSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Replace with actual ledger integration
    setTimeout(() => {
      navigate(RouteUrls.Home);
    }, 2000);
  });

  return (
    <ConnectLedgerSuccessLayout onCancelConnectLedger={() => navigate(RouteUrls.Onboarding)} />
  );
};
