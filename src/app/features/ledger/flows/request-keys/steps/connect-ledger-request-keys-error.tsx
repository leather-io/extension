import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { ConnectLedgerErrorLayout } from '@app/features/ledger/steps/connect-ledger-error.layout';
import { immediatelyAttemptLedgerConnection } from '@app/features/ledger/hooks/use-when-reattempt-ledger-connection';
import { useLatestLedgerError } from '@app/features/ledger/hooks/use-ledger-latest-route-error.hook';

export const ConnectLedgerRequestKeysError = () => {
  const navigate = useNavigate();
  const latestLedgerError = useLatestLedgerError();

  return (
    <ConnectLedgerErrorLayout
      warningText={latestLedgerError}
      onCancelConnectLedger={() => navigate(RouteUrls.Onboarding)}
      onTryAgain={() =>
        navigate(`../${RouteUrls.ConnectLedger}`, {
          replace: true,
          state: { [immediatelyAttemptLedgerConnection]: true },
        })
      }
    />
  );
};
