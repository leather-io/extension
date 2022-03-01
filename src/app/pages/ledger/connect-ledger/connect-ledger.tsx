import { useContext, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RouteUrls } from '@shared/route-urls';

import { ConnectLedgerLayout } from './connect-ledger.layout';

import { useWhenReattemptingLedgerConnection } from '../use-when-reattempt-ledger-connection';

import { ledgerOnboardingContext } from '../ledger-container';
import { LedgerInfoLabel } from './components/ledger-info-label';
import { LedgerError } from '@zondax/ledger-blockstack';

export const ConnectLedger = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { pullPublicKeysFromDevice, latestDeviceResponse, awaitingDeviceConnection } =
    useContext(ledgerOnboardingContext);

  const isLookingForLedger = location.state && (location.state as any).isLookingForLedger;

  useWhenReattemptingLedgerConnection(() => pullPublicKeysFromDevice());

  const warnings = useMemo(() => {
    if (isLookingForLedger) return null;
    // if (latestDeviceResponse?.status === 'success') return null;
    if (latestDeviceResponse?.deviceLocked)
      return (
        <LedgerInfoLabel>
          Your Ledger is locked. Unlock it and open the Stacks app to continue.
        </LedgerInfoLabel>
      );
    if (latestDeviceResponse?.returnCode === LedgerError.AppDoesNotSeemToBeOpen)
      return <LedgerInfoLabel>App doesn't appear to be open</LedgerInfoLabel>;
    return null;
  }, [isLookingForLedger, latestDeviceResponse]);

  return (
    <>
      <ConnectLedgerLayout
        awaitingLedgerConnection={awaitingDeviceConnection}
        isLookingForLedger={isLookingForLedger}
        warning={warnings}
        onCancelConnectLedger={() => navigate(RouteUrls.Onboarding)}
        onConnectLedger={pullPublicKeysFromDevice}
      />
    </>
  );
};
