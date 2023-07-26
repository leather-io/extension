import { useState } from 'react';

import { safeAwait } from '@stacks/ui';

import { delay } from '@app/common/utils';

import { LedgerTxSigningContext } from '../flows/stacks-tx-signing/ledger-sign-tx.context';
import { getStacksAppVersion } from './stacks-ledger-utils';

export interface BaseLedgerOperationContext {
  latestDeviceResponse: null | Awaited<ReturnType<typeof getStacksAppVersion>>;
  awaitingDeviceConnection: boolean;
}

const targetIdMap = new Map([
  ['31100004', 'Nano S'],
  ['33000004', 'Nano X'],
]);
export function extractDeviceNameFromKnownTargetIds(targetId: string) {
  return targetIdMap.get(targetId);
}
export function useLedgerResponseState() {
  return useState<LedgerTxSigningContext['latestDeviceResponse']>(null);
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
