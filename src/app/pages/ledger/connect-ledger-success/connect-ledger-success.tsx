import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { ConnectLedgerSuccessLayout } from './connect-ledger-success.layout';
import { useEffect } from 'react';

export const ConnectLedgerSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => navigate(RouteUrls.Home), 3000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ConnectLedgerSuccessLayout onCancelConnectLedger={() => navigate(RouteUrls.Onboarding)} />
  );
};
