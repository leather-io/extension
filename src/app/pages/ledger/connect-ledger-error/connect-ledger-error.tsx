import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { ConnectLedgerErrorLayout } from './connect-ledger-error.layout';

export const ConnectLedgerError = () => {
  const navigate = useNavigate();

  return (
    <ConnectLedgerErrorLayout
      onCancelConnectLedger={() => navigate(RouteUrls.Onboarding)}
      onTryAgain={() => {}} // TODO: Replace with actual ledger integration
    />
  );
};
