import { useMemo, useState } from 'react';

import StacksApp from '@zondax/ledger-stacks';
import BitcoinApp from 'ledger-bitcoin';

import type { SupportedBlockchains } from '@leather.io/models';
import { delay, isError } from '@leather.io/utils';

import { useLedgerNavigate } from '../../hooks/use-ledger-navigate';
import { BitcoinAppVersion } from '../../utils/bitcoin-ledger-utils';
import {
  LedgerConnectionErrors,
  checkLockedDeviceError,
  useLedgerResponseState,
} from '../../utils/generic-ledger-utils';
import { StacksAppVersion } from '../../utils/stacks-ledger-utils';
import { createWaitForUserToSeeWarningScreen } from './ledger-sign-tx.context';

interface UseLedgerSignTxArgs<App extends BitcoinApp | StacksApp> {
  chain: SupportedBlockchains;
  isAppOpen({ name }: { name: string }): boolean;
  getAppVersion(app: App): Promise<StacksAppVersion> | Promise<BitcoinAppVersion>;
  connectApp(): Promise<App>;
  passesAdditionalVersionCheck?(appVersion: StacksAppVersion | BitcoinAppVersion): Promise<boolean>;
  onSuccess?(): void;
  signTransactionWithDevice(app: App): Promise<void>;
}

export function useLedgerSignTx<App extends StacksApp | BitcoinApp>({
  chain,
  isAppOpen,
  getAppVersion,
  connectApp,
  onSuccess,
  signTransactionWithDevice,
  passesAdditionalVersionCheck,
}: UseLedgerSignTxArgs<App>) {
  const [outdatedAppVersionWarning, setAppVersionOutdatedWarning] = useState(false);
  const [latestDeviceResponse, setLatestDeviceResponse] = useLedgerResponseState();
  const [awaitingDeviceConnection, setAwaitingDeviceConnection] = useState(false);
  const ledgerNavigate = useLedgerNavigate();
  const hasUserSkippedBuggyAppWarning = useMemo(() => createWaitForUserToSeeWarningScreen(), []);
  async function checkCorrectAppIsOpenWithFailState(app: App) {
    const response = await getAppVersion(app);
    if (!isAppOpen({ name: response.name })) {
      setAwaitingDeviceConnection(false);
      throw new Error(LedgerConnectionErrors.AppNotOpen);
    }
    const passedAdditionalVersionCheck = await passesAdditionalVersionCheck?.(response);
    if (passedAdditionalVersionCheck) {
      return response;
    }
    return;
  }

  async function signTransactionImpl() {
    let app;
    try {
      setLatestDeviceResponse({ deviceLocked: false } as any);
      setAwaitingDeviceConnection(true);
      app = await connectApp();
      await checkCorrectAppIsOpenWithFailState(app);
      setAwaitingDeviceConnection(false);
      ledgerNavigate.toConnectionSuccessStep(chain);
      await delay(1250);
      await signTransactionWithDevice(app);
      onSuccess?.();
    } catch (e) {
      setAwaitingDeviceConnection(false);
      if (isError(e) && checkLockedDeviceError(e)) {
        setLatestDeviceResponse({ deviceLocked: true } as any);
        return;
      }

      ledgerNavigate.toErrorStep(chain);
    } finally {
      await app?.transport.close();
    }
  }

  return {
    signTransaction: signTransactionImpl,
    outdatedAppVersionWarning,
    setAppVersionOutdatedWarning,
    latestDeviceResponse,
    setLatestDeviceResponse,
    awaitingDeviceConnection,
    setAwaitingDeviceConnection,
    hasUserSkippedBuggyAppWarning,
  };
}
