import { useState } from 'react';

import StacksApp from '@zondax/ledger-stacks';
import AppClient from 'ledger-bitcoin';

import { SupportedBlockchains } from '@shared/constants';

import { delay } from '@app/common/utils';

import { useLedgerAnalytics } from '../../hooks/use-ledger-analytics.hook';
import { useLedgerNavigate } from '../../hooks/use-ledger-navigate';
import { checkLockedDeviceError, useLedgerResponseState } from '../../utils/generic-ledger-utils';

export enum LedgerConnectionErrors {
  FailedToConnect = 'FailedToConnect',
  AppNotOpen = 'AppNotOpen',
  AppVersionOutdated = 'AppVersionOutdated',
  DeviceNotConnected = 'DeviceNotConnected',
  DeviceLocked = 'DeviceLocked',
  IncorrectAppOpened = 'INCORRECT_APP_OPENED',
}

interface UseRequestLedgerKeysArgs<App> {
  chain: SupportedBlockchains;
  isAppOpen(args: any): boolean;
  getAppVersion(app: App): Promise<unknown>;
  connectApp(): Promise<App>;
  pullKeysFromDevice(app: App): Promise<void>;
  onSuccess(): void;
}
export function useRequestLedgerKeys<App extends AppClient | StacksApp>({
  chain,
  connectApp,
  getAppVersion,
  pullKeysFromDevice,
  isAppOpen,
  onSuccess,
}: UseRequestLedgerKeysArgs<App>) {
  const [outdatedAppVersionWarning, setAppVersionOutdatedWarning] = useState(false);
  const [latestDeviceResponse, setLatestDeviceResponse] = useLedgerResponseState();
  const [awaitingDeviceConnection, setAwaitingDeviceConnection] = useState(false);
  const ledgerNavigate = useLedgerNavigate();
  const ledgerAnalytics = useLedgerAnalytics();

  async function connectLedgerWithFailState() {
    const app = await connectApp();
    return app;
  }

  async function checkCorrectAppIsOpenWithFailState(app: App) {
    const response = await getAppVersion(app);

    if (!isAppOpen(response)) {
      setAwaitingDeviceConnection(false);
      throw new Error(LedgerConnectionErrors.AppNotOpen);
    }
    return response;
  }

  async function pullKeys() {
    let app;
    try {
      setLatestDeviceResponse({ deviceLocked: false } as any);
      setAwaitingDeviceConnection(true);
      app = await connectLedgerWithFailState();
      await checkCorrectAppIsOpenWithFailState(app);
      setAwaitingDeviceConnection(false);
      ledgerNavigate.toConnectionSuccessStep(chain);
      await delay(1250);
      await pullKeysFromDevice(app);
      ledgerAnalytics.publicKeysPulledFromLedgerSuccessfully();
      await app.transport.close();
      onSuccess?.();
    } catch (e) {
      setAwaitingDeviceConnection(false);
      if (e instanceof Error && checkLockedDeviceError(e)) {
        setLatestDeviceResponse({ deviceLocked: true } as any);
        return;
      }

      ledgerNavigate.toErrorStep();
      return app?.transport.close();
    }
  }

  return {
    async requestKeys() {
      await pullKeys();
    },
    outdatedAppVersionWarning,
    setAppVersionOutdatedWarning,
    latestDeviceResponse,
    setLatestDeviceResponse,
    awaitingDeviceConnection,
    setAwaitingDeviceConnection,
  };
}
