import { useState } from 'react';
import toast from 'react-hot-toast';
import { Outlet, useNavigate } from 'react-router-dom';

import { LedgerError } from '@zondax/ledger-stacks';

import { logger } from '@shared/logger';
import { RouteUrls } from '@shared/route-urls';

import { useScrollLock } from '@app/common/hooks/use-scroll-lock';
import { delay } from '@app/common/utils';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import {
  LedgerRequestKeysContext,
  LedgerRequestKeysProvider,
} from '@app/features/ledger/flows/stacks-request-keys/ledger-request-keys.context';
import { useLedgerAnalytics } from '@app/features/ledger/hooks/use-ledger-analytics.hook';
import { useLedgerNavigate } from '@app/features/ledger/hooks/use-ledger-navigate';
import {
  doesLedgerStacksAppVersionSupportJwtAuth,
  getStacksAppVersion,
  isStacksLedgerAppClosed,
  prepareLedgerDeviceStacksAppConnection,
  useActionCancellableByUser,
} from '@app/features/ledger/utils/stacks-ledger-utils';

import { useLedgerResponseState } from '../../utils/generic-ledger-utils';
import { pullStacksKeysFromLedgerDevice } from './request-stacks-keys.utils';
import { useTriggerLedgerDeviceRequestStacksKeys } from './use-trigger-ledger-request-keys';

export function LedgerRequestStacksKeysContainer() {
  const navigate = useNavigate();
  const ledgerNavigate = useLedgerNavigate();
  const ledgerAnalytics = useLedgerAnalytics();

  const canUserCancelAction = useActionCancellableByUser();

  useScrollLock(true);

  const { completeLedgerDeviceOnboarding, fireErrorMessageToast } =
    useTriggerLedgerDeviceRequestStacksKeys();

  const [outdatedAppVersionWarning, setAppVersionOutdatedWarning] = useState(false);
  const [latestDeviceResponse, setLatestDeviceResponse] = useLedgerResponseState();
  const [awaitingDeviceConnection, setAwaitingDeviceConnection] = useState(false);

  const pullPublicKeysFromDevice = async () => {
    const stacksApp = await prepareLedgerDeviceStacksAppConnection({
      setLoadingState: setAwaitingDeviceConnection,
      onError() {
        ledgerNavigate.toErrorStep();
      },
    });

    const versionInfo = await getStacksAppVersion(stacksApp);
    ledgerAnalytics.trackDeviceVersionInfo(versionInfo);
    setLatestDeviceResponse(versionInfo);

    if (versionInfo.deviceLocked) {
      setAwaitingDeviceConnection(false);
      return;
    }

    if (versionInfo.returnCode !== LedgerError.NoErrors) {
      if (!isStacksLedgerAppClosed(versionInfo)) toast.error(versionInfo.errorMessage);
      return;
    }

    if (doesLedgerStacksAppVersionSupportJwtAuth(versionInfo)) {
      setAppVersionOutdatedWarning(true);
      return;
    }

    try {
      ledgerNavigate.toConnectionSuccessStep();
      await delay(1250);

      const resp = await pullStacksKeysFromLedgerDevice(stacksApp)({
        onRequestKey(index) {
          ledgerNavigate.toDeviceBusyStep(`Requesting STX addresses (${index + 1}…5)`);
        },
      });
      if (resp.status === 'failure') {
        fireErrorMessageToast(resp.errorMessage);
        ledgerNavigate.toErrorStep(resp.errorMessage);
        return;
      }
      ledgerNavigate.toDeviceBusyStep();
      completeLedgerDeviceOnboarding(resp.publicKeys, latestDeviceResponse?.targetId!);
      await stacksApp.transport.close();
      ledgerAnalytics.publicKeysPulledFromLedgerSuccessfully();
      navigate(RouteUrls.Home, { replace: true });
    } catch (e) {
      logger.error('Failed to request Ledger keys', e);
      ledgerNavigate.toErrorStep();
    }
  };

  const onCancelConnectLedger = () => navigate(RouteUrls.Onboarding);

  const ledgerContextValue: LedgerRequestKeysContext = {
    pullPublicKeysFromDevice,
    latestDeviceResponse,
    awaitingDeviceConnection,
    outdatedAppVersionWarning,
  };

  return (
    <LedgerRequestKeysProvider value={ledgerContextValue}>
      <BaseDrawer
        isShowing
        isWaitingOnPerformedAction={awaitingDeviceConnection || canUserCancelAction}
        onClose={onCancelConnectLedger}
        pauseOnClickOutside
        waitingOnPerformedActionMessage="Ledger device in use"
      >
        <Outlet />
      </BaseDrawer>
    </LedgerRequestKeysProvider>
  );
}
