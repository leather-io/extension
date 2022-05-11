import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LedgerError } from '@zondax/ledger-blockstack';
import { Box } from '@stacks/ui';
import toast from 'react-hot-toast';

import {
  getAppVersion,
  isStacksLedgerAppClosed,
  prepareLedgerDeviceConnection,
  pullKeysFromLedgerDevice,
  useLedgerResponseState,
} from '@app/features/ledger/ledger-utils';
import { delay } from '@app/common/utils';
import { RouteUrls } from '@shared/route-urls';
import { LedgerRequestKeysProvider } from '@app/features/ledger/ledger-request-keys.context';
import { logger } from '@shared/logger';
import { BaseDrawer } from '@app/components/drawer';
import { useLedgerNavigate } from '@app/features/ledger/hooks/use-ledger-navigate';
import { useTriggerLedgerDeviceRequestKeys } from './use-trigger-ledger-request-keys';
import { useLedgerAnalytics } from '@app/features/ledger/hooks/use-ledger-analytics.hook';

export function LedgerRequestKeysContainer() {
  const navigate = useNavigate();
  const ledgerNavigate = useLedgerNavigate();
  const ledgerAnalytics = useLedgerAnalytics();

  const { completeLedgerDeviceOnboarding, fireErrorMessageToast } =
    useTriggerLedgerDeviceRequestKeys();

  const [latestDeviceResponse, setLatestDeviceResponse] = useLedgerResponseState();
  const [awaitingDeviceConnection, setAwaitingDeviceConnection] = useState(false);

  const pullPublicKeysFromDevice = async () => {
    const stacks = await prepareLedgerDeviceConnection({
      setLoadingState: setAwaitingDeviceConnection,
      onError() {
        ledgerNavigate.toErrorStep();
      },
    });

    if (!stacks) return;

    const versionInfo = await getAppVersion(stacks);
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

    try {
      ledgerNavigate.toConnectionSuccessStep();
      await delay(1750);
      ledgerNavigate.toActivityHappeningOnDeviceStep();

      const resp = await pullKeysFromLedgerDevice(stacks);
      if (resp.status === 'failure') {
        fireErrorMessageToast(resp.errorMessage);
        ledgerNavigate.toErrorStep(resp.errorMessage);
        return;
      }
      ledgerNavigate.toActivityHappeningOnDeviceStep();
      completeLedgerDeviceOnboarding(resp.publicKeys, versionInfo.targetId);
      ledgerAnalytics.publicKeysPulledFromLedgerSuccessfully();
      navigate(RouteUrls.Home);
    } catch (e) {
      logger.info(e);
      ledgerNavigate.toErrorStep();
    }
  };

  const onCancelConnectLedger = () => navigate(RouteUrls.Onboarding);

  const ledgerContextValue = {
    pullPublicKeysFromDevice,
    latestDeviceResponse,
    awaitingDeviceConnection,
    onCancelConnectLedger,
  };

  return (
    <LedgerRequestKeysProvider value={ledgerContextValue}>
      <BaseDrawer title={<Box />} isShowing onClose={onCancelConnectLedger}>
        <Outlet />
      </BaseDrawer>
    </LedgerRequestKeysProvider>
  );
}
