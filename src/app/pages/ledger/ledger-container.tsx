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
  pullPublicKeysFromDevice(): Promise<void> | void;
}
export const ledgerOnboardingContext = createContext<LedgerOnboardingContext>({
  latestDeviceResponse: null,
  pullPublicKeysFromDevice: noop,
});

const LedgerOnboardingProvider = ledgerOnboardingContext.Provider;

export function LedgerContainer() {
  const navigate = useNavigate();

  const { completeLedgerDeviceOnboarding, fireErrorMessageToast } =
    useTriggerLedgerDeviceOnboarding();

  const setIsLookingForLedger = useCallback(
    x => navigate(RouteUrls.ConnectLedger, { state: { isLookingForLedger: x } }),
    [navigate]
  );

  const [latestDeviceResponse, setLatestDeviceResponse] =
    useState<LedgerOnboardingContext['latestDeviceResponse']>(null);

  const [connectBtnLoading, setConnectBtnLoading] = useState(false);

  const pullPublicKeysFromDevice = useCallback(async () => {
    console.log('connect ledger device');
    const [error, stacks] = await safeAwait(connectLedger());

    if (error) {
      navigate(RouteUrls.ConnectLedgerError);
      return;
    }
    if (stacks) {
      setIsLookingForLedger(true);
      const versionInfo = await getAppVersion(stacks);
      setLatestDeviceResponse(versionInfo);
      console.log({ versionInfo });

      if (versionInfo.returnCode !== LedgerError.NoErrors) {
        setIsLookingForLedger(false);
        await delay(1000);
        toast.error(versionInfo.errorMessage);
        return;
      }

      try {
        const resp = await pullKeysFromLedgerDevice(stacks);
        if (resp.status === 'failure') {
          setIsLookingForLedger(false);
          fireErrorMessageToast(resp.errorMessage);
          navigate(RouteUrls.ConnectLedgerError, {
            state: { latestLedgerError: resp.errorMessage },
          });
          return;
        }
        setIsLookingForLedger(true);
        completeLedgerDeviceOnboarding(resp.publicKeys);
        setIsLookingForLedger(false);
        navigate(RouteUrls.ConnectLedgerSuccess);
      } catch (e) {
        console.log(e);
      }
    }
  }, [completeLedgerDeviceOnboarding, fireErrorMessageToast, navigate, setIsLookingForLedger]);

  const ledgerContextValue = useMemo(
    () => ({
      pullPublicKeysFromDevice,
      latestDeviceResponse,
    }),
    [latestDeviceResponse, pullPublicKeysFromDevice]
  );

  return (
    <LedgerOnboardingProvider value={ledgerContextValue}>
      <Outlet />
    </LedgerOnboardingProvider>
  );
}
