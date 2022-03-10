import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { LedgerDisconnectedLayout } from './ledger-disconnected.layout';

export const LedgerDisconnected = () => {
  const navigate = useNavigate();

  return <LedgerDisconnectedLayout onCloseModal={() => navigate(RouteUrls.Transaction)} />;
};
