import { useState } from 'react';

import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import BitcoinApp from 'ledger-bitcoin';

import { delay } from '@app/common/utils';
import { safeAwait } from '@app/common/utils/safe-await';

import { LedgerConnectionErrors } from '../generic-flows/request-keys/use-request-ledger-keys';
import { getStacksAppVersion } from './stacks-ledger-utils';

export const LEDGER_APPS_MAP = {
  STACKS: 'Stacks',
  BITCOIN_MAINNET: 'Bitcoin',
  BITCOIN_TESTNET: 'Bitcoin Test',
  MAIN_MENU: 'BOLOS',
} as const;

export type LatestDeviceResponse = null | Awaited<ReturnType<typeof getStacksAppVersion>>;

export interface BaseLedgerOperationContext {
  latestDeviceResponse: LatestDeviceResponse;
  awaitingDeviceConnection: boolean;
  incorrectAppOpened: boolean;
}

const targetIdMap = new Map([
  ['31100004', 'Nano S'],
  ['33000004', 'Nano X'],
]);
export function extractDeviceNameFromKnownTargetIds(targetId: string) {
  return targetIdMap.get(targetId);
}
export function useLedgerResponseState() {
  return useState<LatestDeviceResponse>(null);
}

export type SemVerObject = Record<'major' | 'minor' | 'patch', number>;

export function versionObjectToVersionString(version: SemVerObject) {
  return [version.major, version.minor, version.patch].join('.');
}

export interface PrepareLedgerDeviceConnectionArgs {
  setLoadingState(loadingState: boolean): void;
  onError(error?: Error): void;
}
export function prepareLedgerDeviceForAppFn<T extends () => Promise<unknown>>(connectAppFn: T) {
  return async (args: PrepareLedgerDeviceConnectionArgs) => {
    const { setLoadingState, onError } = args;
    setLoadingState(true);
    const [error, app] = await safeAwait(connectAppFn());
    await delay(1000);
    setLoadingState(false);

    if (error || !app) {
      onError(error);
      throw new Error('Unable to initiate Ledger app');
    }

    return app;
  };
}

export async function promptOpenAppOnDevice(appName: string) {
  const tmpTransport = await TransportWebUSB.create();
  const tmpBitcoinApp = new BitcoinApp(tmpTransport);
  const resp = await tmpBitcoinApp.getAppAndVersion();
  if (resp.name !== appName && resp.name !== LEDGER_APPS_MAP.MAIN_MENU) {
    throw new Error(LedgerConnectionErrors.IncorrectAppOpened);
  }
  if (resp.name !== appName) {
    await tmpTransport.send(0xe0, 0xd8, 0x00, 0x00, Buffer.from(appName, 'ascii'));
  }
  // for some reason sending open app buffer to ledger will close the connection afterwards.
  // we need to add a delay for this transport to properly finish for another one to open.
  await delay(500);
}

export function checkLockedDeviceError(e: any) {
  return !!(
    e?.name === 'LockedDeviceError' ||
    e?.message?.includes('LockedDeviceError') ||
    e?.message === LedgerConnectionErrors.DeviceLocked
  );
}

export function checkIncorrectAppOpenedError(e: any) {
  return e.message === LedgerConnectionErrors.IncorrectAppOpened;
}
