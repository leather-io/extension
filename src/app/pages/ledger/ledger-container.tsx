import { createContext, useCallback, useMemo, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LedgerError } from '@zondax/ledger-blockstack';
import toast from 'react-hot-toast';

import { delay, noop } from '@app/common/utils';
import { safeAwait } from '@stacks/ui';
import {
  connectLedger,
  getAppVersion,
  pullKeysFromLedgerDevice,
  useTriggerLedgerDeviceOnboarding,
} from '@app/features/ledger/ledger-utils';
import { RouteUrls } from '@shared/route-urls';

interface LedgerOnboardingContext {
  latestDeviceResponse: null | Awaited<ReturnType<typeof getAppVersion>>;
  awaitingDeviceConnection: boolean;
  pullPublicKeysFromDevice(): Promise<void> | void;
}
export const ledgerOnboardingContext = createContext<LedgerOnboardingContext>({
  latestDeviceResponse: null,
  awaitingDeviceConnection: false,
  pullPublicKeysFromDevice: noop,
});

const LedgerOnboardingProvider = ledgerOnboardingContext.Provider;

export function LedgerContainer() {
  const navigate = useNavigate();

  const { completeLedgerDeviceOnboarding, fireErrorMessageToast } =
    useTriggerLedgerDeviceOnboarding();

  const setIsLookingForLedger = useCallback(
    x =>
      navigate(RouteUrls.ConnectLedger, {
        replace: true,
        state: { isLookingForLedger: x },
      }),
    [navigate]
  );

  const [latestDeviceResponse, setLatestDeviceResponse] =
    useState<LedgerOnboardingContext['latestDeviceResponse']>(null);

  const [awaitingDeviceConnection, setAwaitingDeviceConnection] = useState(false);

  const pullPublicKeysFromDevice = useCallback(async () => {
    console.log('connect ledger device');
    setAwaitingDeviceConnection(true);
    const [error, stacks] = await safeAwait(connectLedger());
    await delay(1000);
    setAwaitingDeviceConnection(false);

    if (error) {
      navigate(RouteUrls.ConnectLedgerError, { replace: true });
      return;
    }
    if (stacks) {
      const versionInfo = await getAppVersion(stacks);
      setLatestDeviceResponse(versionInfo);
      console.log({ versionInfo });

      if (versionInfo.deviceLocked) {
        // setIsLookingForLedger(false);
        setAwaitingDeviceConnection(false);
        return;
      }

      if (versionInfo.returnCode !== LedgerError.NoErrors) {
        // setIsLookingForLedger(false);
        await delay(1000);
        toast.error(versionInfo.errorMessage);
        return;
      }

      try {
        setIsLookingForLedger(true);
        const resp = await pullKeysFromLedgerDevice(stacks);
        if (resp.status === 'failure') {
          setIsLookingForLedger(false);
          fireErrorMessageToast(resp.errorMessage);
          navigate(RouteUrls.ConnectLedgerError, {
            replace: true,
            state: { latestLedgerError: resp.errorMessage },
          });
          return;
        }
        setIsLookingForLedger(true);
        completeLedgerDeviceOnboarding(resp.publicKeys);
        setIsLookingForLedger(false);
        navigate(RouteUrls.ConnectLedgerSuccess, { replace: true });
      } catch (e) {
        console.log(e);
      }
    }
  }, [completeLedgerDeviceOnboarding, fireErrorMessageToast, navigate, setIsLookingForLedger]);

  const ledgerContextValue = useMemo(
    () => ({ pullPublicKeysFromDevice, latestDeviceResponse, awaitingDeviceConnection }),
    [awaitingDeviceConnection, latestDeviceResponse, pullPublicKeysFromDevice]
  );

  return (
    <LedgerOnboardingProvider value={ledgerContextValue}>
      <Outlet />
    </LedgerOnboardingProvider>
  );
}
