import Transport from '@ledgerhq/hw-transport-webusb';
import {
  AddressVersion,
  SingleSigSpendingCondition,
  createMessageSignature,
  deserializeTransaction,
} from '@stacks/transactions';
import StacksApp, { LedgerError, ResponseSign, ResponseVersion } from '@zondax/ledger-stacks';
import { compare } from 'compare-versions';

import { makeStxDerivationPath, stxDerivationWithAccount } from '@leather.io/stacks';

import {
  LEDGER_APPS_MAP,
  PrepareLedgerDeviceConnectionArgs,
  SemVerObject,
  prepareLedgerDeviceForAppFn,
  promptOpenAppOnDevice,
  versionObjectToVersionString,
} from './generic-ledger-utils';

export function requestPublicKeyForStxAccount(app: StacksApp) {
  return async (index: number) =>
    app.getAddressAndPubKey(
      makeStxDerivationPath(index),
      // We pass mainnet as it expects something, however this is so it can return a formatted address
      // We only need the public key, and can derive the address later in any network format
      AddressVersion.MainnetSingleSig
    );
}

export interface StacksAppKeysResponseItem {
  path: string;
  stxPublicKey: string;
  dataPublicKey: string;
}

export async function connectLedgerStacksApp() {
  await promptOpenAppOnDevice(LEDGER_APPS_MAP.STACKS);
  const transport = await Transport.create();
  return new StacksApp(transport);
}

export interface StacksAppVersion extends Awaited<ReturnType<StacksApp['getVersion']>> {
  name: 'Stacks';
  chain: 'stacks';
}

export async function getStacksAppVersion(app: StacksApp): Promise<StacksAppVersion> {
  const appVersion = await app.getVersion();
  if (appVersion.errorMessage !== 'No errors') {
    throw new Error(appVersion.errorMessage);
  }
  return { name: LEDGER_APPS_MAP.STACKS, chain: 'stacks' as const, ...appVersion };
}

export const prepareLedgerDeviceStacksAppConnection = prepareLedgerDeviceForAppFn(
  connectLedgerStacksApp
  // Casting type here as factory function reads it was a double Promise
) as (args: PrepareLedgerDeviceConnectionArgs) => Promise<StacksApp>;

export function signLedgerStacksTransaction(app: StacksApp) {
  return async (payload: Buffer, accountIndex: number) =>
    app.sign(stxDerivationWithAccount.replace('{account}', accountIndex.toString()), payload);
}

export function signLedgerStacksUtf8Message(app: StacksApp) {
  return async (payload: string, accountIndex: number): Promise<ResponseSign> =>
    app.sign_msg(makeStxDerivationPath(accountIndex), payload);
}

export function signLedgerStacksStructuredMessage(app: StacksApp) {
  return async (domain: string, payload: string, accountIndex: number): Promise<ResponseSign> =>
    app.sign_structured_msg(makeStxDerivationPath(accountIndex), domain, payload);
}

export function signStacksTransactionWithSignature(transaction: string, signatureVRS: Buffer) {
  const deserializedTx = deserializeTransaction(transaction);
  const spendingCondition = createMessageSignature(signatureVRS.toString('hex'));
  (deserializedTx.auth.spendingCondition as SingleSigSpendingCondition).signature =
    spendingCondition;
  return deserializedTx;
}

export function isStacksLedgerAppClosed(response: ResponseVersion) {
  const anotherUnknownErrorCodeMeaningAppClosed = 28161;
  return (
    response.returnCode === LedgerError.AppDoesNotSeemToBeOpen ||
    response.returnCode === anotherUnknownErrorCodeMeaningAppClosed
  );
}

// https://github.com/Zondax/ledger-stacks/issues/119
// https://github.com/hirosystems/wallet/issues/2567
const versionFromWhichContractPrincipalBugIsFixed = '0.23.3';

export function isVersionOfLedgerStacksAppWithContractPrincipalBug(
  currentDeviceVersion: SemVerObject
) {
  return compare(
    versionObjectToVersionString(currentDeviceVersion),
    versionFromWhichContractPrincipalBugIsFixed,
    '<'
  );
}

export function isStacksAppOpen({ name }: { name: string }) {
  return name === LEDGER_APPS_MAP.STACKS;
}
