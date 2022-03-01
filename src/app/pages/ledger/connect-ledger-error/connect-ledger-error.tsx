import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { immediatelyAttemptLedgerConnection } from '../use-when-reattempt-ledger-connection';
import { ConnectLedgerErrorLayout } from './connect-ledger-error.layout';

export const ConnectLedgerError = () => {
  const navigate = useNavigate();

  return (
    <ConnectLedgerErrorLayout
      onCancelConnectLedger={() => navigate(RouteUrls.Onboarding)}
      onTryAgain={() =>
        navigate(RouteUrls.ConnectLedger, {
          state: { [immediatelyAttemptLedgerConnection]: true },
        })
      }
    />
  );
};
