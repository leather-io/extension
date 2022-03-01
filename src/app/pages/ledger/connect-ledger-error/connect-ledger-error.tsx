import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { immediatelyAttemptLedgerConnection } from '../use-when-reattempt-ledger-connection';
import { ConnectLedgerErrorLayout } from './connect-ledger-error.layout';

function useLedgerOnboardingError() {
  const location = useLocation();
  return useMemo(() => {
    const state = location.state;
    if (!state || state === null) return null;
    if (typeof state === 'object') {
      const error = (state as any).latestLedgerError;
      if (error) return error;
    }
    return null;
  }, [location.state]);
}

export const ConnectLedgerError = () => {
  const navigate = useNavigate();
  const latestLedgerError = useLedgerOnboardingError();

  return (
    <ConnectLedgerErrorLayout
      warningText={latestLedgerError}
      onCancelConnectLedger={() => navigate(RouteUrls.Onboarding)}
      onTryAgain={() =>
        navigate(RouteUrls.ConnectLedger, {
          state: { [immediatelyAttemptLedgerConnection]: true },
        })
      }
    />
  );
};
