import { useContext, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RouteUrls } from '@shared/route-urls';

import { ConnectLedgerLayout } from './connect-ledger.layout';
import { LedgerInfoLabel } from './components/ledger-info-label';

import { useWhenReattemptingLedgerConnection } from '../use-when-reattempt-ledger-connection';

import { ledgerOnboardingContext } from '../ledger-container';

export const ConnectLedger = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const ctx = useContext(ledgerOnboardingContext);

  const isLookingForLedger = location.state && (location.state as any).isLookingForLedger;

  useWhenReattemptingLedgerConnection(() => ctx.onLedgerConnect());

  const warnings = useMemo(() => {
    if (isLookingForLedger) return null;
    // if (latestDeviceResponse?.status === 'success') return null;
    // if (latestDeviceResponse?.returnCode === LedgerError.AppDoesNotSeemToBeOpen)
    return <LedgerInfoLabel>App doesn't appear to be open</LedgerInfoLabel>;
    return null;
  }, [isLookingForLedger]);

  return (
    <>
      <ConnectLedgerLayout
        x={
          <>
            <button
              onClick={() =>
                navigate(RouteUrls.ConnectLedger, {
                  state: { isLookingForLedger: !isLookingForLedger },
                })
              }
            >
              toggle
            </button>
            <button onClick={() => console.log(ctx)}>ctx</button>
          </>
        }
        isLookingForLedger={isLookingForLedger}
        warning={warnings}
        onCancelConnectLedger={() => navigate(RouteUrls.Onboarding)}
        onConnectLedger={ctx.onLedgerConnect}
      />
    </>
  );
};
