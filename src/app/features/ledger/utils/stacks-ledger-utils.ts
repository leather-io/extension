import { useLocation } from 'react-router-dom';

import Transport from '@ledgerhq/hw-transport-webusb';
import {
  AddressVersion,
  SingleSigSpendingCondition,
  createMessageSignature,
  deserializeTransaction,
} from '@stacks/transactions';
import StacksApp, { LedgerError, ResponseSign, ResponseVersion } from '@zondax/ledger-stacks';
import { compare } from 'compare-versions';

import { RouteUrls } from '@shared/route-urls';

import {
  PrepareLedgerDeviceConnectionArgs,
  SemVerObject,
  prepareLedgerDeviceForAppFn,
} from './generic-ledger-utils';
import { versionObjectToVersionString } from './generic-ledger-utils';

const stxDerivationWithAccount = `m/44'/5757'/0'/0/{account}`;

const stxIdentityDerivationWithAccount = `m/888'/0'/{account}'`;

function getAccountIndexFromDerivationPathFactory(derivationPath: string) {
  return (account: number) => derivationPath.replace('{account}', account.toString());
}

const getStxDerivationPath = getAccountIndexFromDerivationPathFactory(stxDerivationWithAccount);

export const getIdentityDerivationPath = getAccountIndexFromDerivationPathFactory(
  stxIdentityDerivationWithAccount
);

export function requestPublicKeyForStxAccount(app: StacksApp) {
  return async (index: number) =>
    app.getAddressAndPubKey(
      getStxDerivationPath(index),
      // We pass mainnet as it expects something, however this is so it can return a formatted address
      // We only need the public key, and can derive the address later in any network format
      AddressVersion.MainnetSingleSig
    );
}

export interface StxAndIdentityPublicKeys {
  stxPublicKey: string;
  dataPublicKey: string;
}

export async function connectLedgerStacksApp() {
  const transport = await Transport.create();
  return new StacksApp(transport);
}

export async function getStacksAppVersion(app: StacksApp) {
  const resp = await app.getVersion();
  if (resp.errorMessage !== 'No errors') {
    throw new Error(resp.errorMessage);
  }
  return { name: 'Stacks', ...resp };
}

export const prepareLedgerDeviceStacksAppConnection = prepareLedgerDeviceForAppFn(
  connectLedgerStacksApp
  // Casting type here as factory function reads it was a double Promise
) as (args: PrepareLedgerDeviceConnectionArgs) => Promise<StacksApp>;

export function signLedgerTransaction(app: StacksApp) {
  return async (payload: Buffer, accountIndex: number) =>
    app.sign(stxDerivationWithAccount.replace('{account}', accountIndex.toString()), payload);
}

export function signLedgerUtf8Message(app: StacksApp) {
  return async (payload: string, accountIndex: number): Promise<ResponseSign> =>
    app.sign_msg(getStxDerivationPath(accountIndex), payload);
}

export function signLedgerStructuredMessage(app: StacksApp) {
  return async (domain: string, payload: string, accountIndex: number): Promise<ResponseSign> =>
    app.sign_structured_msg(getStxDerivationPath(accountIndex), domain, payload);
}

export function signTransactionWithSignature(transaction: string, signatureVRS: Buffer) {
  const deserialzedTx = deserializeTransaction(transaction);
  const spendingCondition = createMessageSignature(signatureVRS.toString('hex'));
  (deserialzedTx.auth.spendingCondition as SingleSigSpendingCondition).signature =
    spendingCondition;
  return deserialzedTx;
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
