import Transport from '@ledgerhq/hw-transport-webusb';
import StacksApp, { LedgerError, ResponseVersion } from '@zondax/ledger-blockstack';

import {
  AddressVersion,
  createMessageSignature,
  deserializeTransaction,
  SingleSigSpendingCondition,
} from '@stacks/transactions';

import { delay } from '@app/common/utils';
import { safeAwait } from '@stacks/ui';
import { useState } from 'react';
import { LedgerTxSigningProvider } from './ledger-tx-signing.context';

const stxDerivationWithAccount = `m/44'/5757'/0'/0/{account}`;

async function connectLedger() {
  const transport = await Transport.create();
  return new StacksApp(transport);
}

function requestPublicKeyForAccount(app: StacksApp) {
  return async (index: number) =>
    app.getAddressAndPubKey(
      stxDerivationWithAccount.replace('{account}', index.toString()),
      // We pass mainnet as it expects something, however this is so it can return a formatted address
      // We only need the public key, and can derive the address later in any network format
      AddressVersion.MainnetSingleSig
    );
}

export async function getAppVersion(app: StacksApp) {
  return app.getVersion();
}

const targetIdMap = new Map([
  ['31100004', 'Nano S'],
  ['33000004', 'Nano X'],
]);
export function extractDeviceNameFromKnownTargetIds(targetId: string) {
  return targetIdMap.get(targetId);
}

interface PrepareLedgerDeviceConnectionArgs {
  setLoadingState(loadingState: boolean): void;
  onError(): void;
}
export async function prepareLedgerDeviceConnection(args: PrepareLedgerDeviceConnectionArgs) {
  const { setLoadingState, onError } = args;
  setLoadingState(true);
  const [error, stacks] = await safeAwait(connectLedger());
  await delay(1000);
  setLoadingState(false);

  if (error) {
    onError();
    return;
  }

  return stacks;
}

export function signLedgerTransaction(app: StacksApp) {
  return async (payload: Buffer, accountIndex: number) =>
    app.sign(stxDerivationWithAccount.replace('{account}', accountIndex.toString()), payload);
}

export function signTransactionWithSignature(transaction: string, signatureVRS: Buffer) {
  const deserialzedTx = deserializeTransaction(transaction);
  const spendingCondition = createMessageSignature(signatureVRS.toString('hex'));
  (deserialzedTx.auth.spendingCondition as SingleSigSpendingCondition).signature =
    spendingCondition;
  return deserialzedTx;
}

interface PullKeysFromLedgerSuccess {
  status: 'success';
  publicKeys: string[];
}

interface PullKeysFromLedgerFailure {
  status: 'failure';
  errorMessage: string;
  returnCode: number;
}

type PullKeysFromLedgerResponse = Promise<PullKeysFromLedgerSuccess | PullKeysFromLedgerFailure>;

export async function pullKeysFromLedgerDevice(stacksApp: StacksApp): PullKeysFromLedgerResponse {
  const publicKeys = [];
  const amountOfKeysToExtractFromDevice = 5;
  for (let index = 0; index < amountOfKeysToExtractFromDevice; index++) {
    const resp = await requestPublicKeyForAccount(stacksApp)(index);
    if (!resp.publicKey) return { status: 'failure', ...resp };
    publicKeys.push(resp.publicKey.toString('hex'));
  }
  await delay(1000);
  return { status: 'success', publicKeys };
}

export function useLedgerResponseState() {
  return useState<LedgerTxSigningProvider['latestDeviceResponse']>(null);
}

export function isStacksLedgerAppClosed(response: ResponseVersion) {
  const anotherUnknownErrorCodeMeaningAppClosed = 28161;
  return (
    response.returnCode === LedgerError.AppDoesNotSeemToBeOpen ||
    response.returnCode === anotherUnknownErrorCodeMeaningAppClosed
  );
}
