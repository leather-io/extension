import { useState } from 'react';
import Transport from '@ledgerhq/hw-transport-webusb';
import StacksApp, { LedgerError, ResponseVersion } from '@zondax/ledger-stacks';
import { compare } from 'compare-versions';

import {
  createMessageSignature,
  deserializeTransaction,
  SingleSigSpendingCondition,
} from '@stacks/transactions';

import { delay } from '@app/common/utils';
import { LedgerTxSigningContext } from './flows/tx-signing/ledger-sign-tx.context';
import { safeAwait } from '@stacks/ui';
import { useLocation } from 'react-router-dom';
import { RouteUrls } from '@shared/route-urls';

const stxDerivationWithAccount = `m/44'/5757'/0'/0/{account}`;

const identityDerivationWithAccount = `m/888'/0'/{account}'`;

function getAccountIndexFromDerivationPathFactory(derivationPath: string) {
  return (account: number) => derivationPath.replace('{account}', account.toString());
}

export const getStxDerivationPath =
  getAccountIndexFromDerivationPathFactory(stxDerivationWithAccount);

export const getIdentityDerivationPath = getAccountIndexFromDerivationPathFactory(
  identityDerivationWithAccount
);

export interface StxAndIdentityPublicKeys {
  stxPublicKey: string;
  dataPublicKey: string;
}

async function connectLedger() {
  const transport = await Transport.create();
  return new StacksApp(transport);
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
  onError(error?: Error): void;
}
export async function prepareLedgerDeviceConnection(args: PrepareLedgerDeviceConnectionArgs) {
  const { setLoadingState, onError } = args;
  setLoadingState(true);
  const [error, stacks] = await safeAwait(connectLedger());
  await delay(1000);
  setLoadingState(false);

  if (error || !stacks) {
    onError(error);
    throw new Error('Unable to initiate Ledger Stacks app');
  }

  return stacks;
}

export function signLedgerTransaction(app: StacksApp) {
  return async (payload: Buffer, accountIndex: number) =>
    app.sign(stxDerivationWithAccount.replace('{account}', accountIndex.toString()), payload);
}

export function signLedgerUtf8Message(app: StacksApp) {
  return async (payload: string, accountIndex: number) =>
    app.sign_msg(getStxDerivationPath(accountIndex), payload);
}

export function signTransactionWithSignature(transaction: string, signatureVRS: Buffer) {
  const deserialzedTx = deserializeTransaction(transaction);
  const spendingCondition = createMessageSignature(signatureVRS.toString('hex'));
  (deserialzedTx.auth.spendingCondition as SingleSigSpendingCondition).signature =
    spendingCondition;
  return deserialzedTx;
}

export function useLedgerResponseState() {
  return useState<LedgerTxSigningContext['latestDeviceResponse']>(null);
}

export function useActionCancellableByUser() {
  const { pathname } = useLocation();
  return (
    pathname.includes(RouteUrls.DeviceBusy) ||
    pathname.includes(RouteUrls.ConnectLedgerSuccess) ||
    pathname.includes(RouteUrls.AwaitingDeviceUserAction)
  );
}

export function isStacksLedgerAppClosed(response: ResponseVersion) {
  const anotherUnknownErrorCodeMeaningAppClosed = 28161;
  return (
    response.returnCode === LedgerError.AppDoesNotSeemToBeOpen ||
    response.returnCode === anotherUnknownErrorCodeMeaningAppClosed
  );
}

type SemVerObject = Record<'major' | 'minor' | 'patch', number>;

function versionObjectToVersionString(version: SemVerObject) {
  return [version.major, version.minor, version.patch].join('.');
}

const ledgerStacksAppVersionFromWhichJwtAuthIsSupported = '0.22.5';

export function doesLedgerStacksAppVersionSupportJwtAuth(versionInfo: SemVerObject) {
  return compare(
    ledgerStacksAppVersionFromWhichJwtAuthIsSupported,
    versionObjectToVersionString(versionInfo),
    '>'
  );
}

export interface BaseLedgerOperationContext {
  latestDeviceResponse: null | Awaited<ReturnType<typeof getAppVersion>>;
  awaitingDeviceConnection: boolean;
}
