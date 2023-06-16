import { useState } from 'react';

import { LedgerTxSigningContext } from '../flows/stacks-tx-signing/ledger-sign-tx.context';

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
