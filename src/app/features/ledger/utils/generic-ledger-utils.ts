import { useState } from 'react';

import TransportWebUSB from '@ledgerhq/hw-transport-webusb';

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

async function getAppAndVersion(
  transport: Awaited<ReturnType<typeof TransportWebUSB.create>>
): Promise<{
  name: string;
  version: string;
  flags: number | Buffer;
}> {
  const r = await transport.send(0xb0, 0x01, 0x00, 0x00);
  let i = 0;
  const format = r[i++];

  if (format !== 1) {
    throw new Error('getAppAndVersion: format not supported');
  }

  const nameLength = r[i++];
  const name = r.subarray(i, (i += nameLength)).toString('ascii');
  const versionLength = r[i++];
  const version = r.subarray(i, (i += versionLength)).toString('ascii');
  const flagLength = r[i++];
  const flags = r.subarray(i, (i += flagLength));
  return {
    name,
    version,
    flags,
  };
}

export async function promptOpenAppOnDevice(appName: string) {
  const tmpTransport = await TransportWebUSB.create();
  const r = await getAppAndVersion(tmpTransport);
  if (r.name !== appName && r.name !== LEDGER_APPS_MAP.MAIN_MENU) {
    throw new Error(LedgerConnectionErrors.IncorrectAppOpened);
  }
  if (r.name !== appName) {
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
