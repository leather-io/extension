import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';
import {
  connectLedger,
  getAppVersion,
  useTriggerLedgerDeviceOnboarding,
} from '@app/features/ledger/ledger-utils';

import { ConnectLedgerLayout } from './connect-ledger.layout';
import { LedgerInfoLabel } from './components/ledger-info-label';
import { LedgerError } from '@zondax/ledger-blockstack';

export const ConnectLedger = () => {
  const [isLookingForLedger, setIsLookingForLedger] = useState(false);
  const [latestDeviceResponse, setLatestDeviceResponse] =
    useState<Awaited<ReturnType<typeof getAppVersion>>>();
  const navigate = useNavigate();

  const { completeLedgerDeviceOnboarding, fireErrorMessageToast } =
    useTriggerLedgerDeviceOnboarding();

  const connectLedgerDevice = useCallback(async () => {
    console.log('connect to ledger');
    try {
      const stacks = await connectLedger();
      // setIsLookingForLedger(true);
      // const versionInfo = await getAppVersion(stacks);
      // setLatestDeviceResponse(versionInfo);
      // console.log(versionInfo);

      // if (versionInfo.returnCode !== LedgerError.NoErrors) return;
    } catch (e) {
      console.log(e);
    }

    try {
      // const resp = await pullKeysFromLedgerDevice(stacks);
      // setLatestDeviceResponse(resp);
      // console.log(resp);
      // if (resp.status === 'failure') {
      //   // console.log(resp);
      //   setIsLookingForLedger(false);
      //   return fireErrorMessageToast(resp.errorMessage);
      // }
      // setIsLookingForLedger(true);
      // completeLedgerDeviceOnboarding(resp.publicKeys);
      setIsLookingForLedger(false);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const warnings = useMemo(() => {
    if (isLookingForLedger) return null;
    if (latestDeviceResponse?.status === 'success') return null;
    if (latestDeviceResponse?.returnCode === LedgerError.AppDoesNotSeemToBeOpen)
      return <LedgerInfoLabel>App doesn't appear to be open</LedgerInfoLabel>;
  }, [isLookingForLedger, latestDeviceResponse]);

  return (
    <ConnectLedgerLayout
      isLookingForLedger={isLookingForLedger}
      warning={warnings}
      onCancelConnectLedger={() => navigate(RouteUrls.Onboarding)}
      onConnectLedger={connectLedgerDevice}
    />
  );
};
