import { useState } from 'react';

import StacksApp from '@zondax/ledger-stacks';
import BitcoinApp from 'ledger-bitcoin';

import type { SupportedBlockchains } from '@leather.io/models';
import { delay, isError } from '@leather.io/utils';

import { useLedgerAnalytics } from '../../hooks/use-ledger-analytics.hook';
import { useLedgerNavigate } from '../../hooks/use-ledger-navigate';
import { BitcoinAppVersion } from '../../utils/bitcoin-ledger-utils';
import {
  LedgerConnectionErrors,
  checkLockedDeviceError,
  useLedgerResponseState,
} from '../../utils/generic-ledger-utils';
import { StacksAppVersion } from '../../utils/stacks-ledger-utils';

export const defaultNumberOfKeysToPullFromLedgerDevice = 10;

interface UseRequestLedgerKeysArgs<App extends BitcoinApp | StacksApp> {
  chain: SupportedBlockchains;
  isAppOpen({ name }: { name: string }): boolean;
  getAppVersion(app: App): Promise<StacksAppVersion> | Promise<BitcoinAppVersion>;
  connectApp(): Promise<App>;
  pullKeysFromDevice(app: App): Promise<void>;
  onSuccess(): void;
}
export function useRequestLedgerKeys<App extends BitcoinApp | StacksApp>({
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

  async function checkCorrectAppIsOpenWithFailState(app: App) {
    const response = await getAppVersion(app);

    if (!isAppOpen({ name: response.name })) {
      setAwaitingDeviceConnection(false);
      throw new Error(LedgerConnectionErrors.AppNotOpen);
    }
    return response;
  }

  async function requestKeys() {
    let app;
    try {
      setLatestDeviceResponse({ deviceLocked: false } as any);
      setAwaitingDeviceConnection(true);
      app = await connectApp();
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
      if (isError(e) && checkLockedDeviceError(e)) {
        setLatestDeviceResponse({ deviceLocked: true } as any);
        return;
      }

      ledgerNavigate.toErrorStep(chain);
      return app?.transport.close();
    }
  }

  return {
    requestKeys,
    outdatedAppVersionWarning,
    setAppVersionOutdatedWarning,
    latestDeviceResponse,
    setLatestDeviceResponse,
    awaitingDeviceConnection,
    setAwaitingDeviceConnection,
  };
}
