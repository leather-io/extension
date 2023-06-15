import { useLocation } from 'react-router-dom';

import Transport from '@ledgerhq/hw-transport-webusb';
import {
  AddressVersion,
  SingleSigSpendingCondition,
  createMessageSignature,
  deserializeTransaction,
} from '@stacks/transactions';
import { safeAwait } from '@stacks/ui';
import StacksApp, { LedgerError, ResponseSign, ResponseVersion } from '@zondax/ledger-stacks';
import { compare } from 'compare-versions';

import { RouteUrls } from '@shared/route-urls';

import { delay } from '@app/common/utils';

import { SemVerObject } from './generic-ledger-utils';
import { versionObjectToVersionString } from './generic-ledger-utils';

export interface BaseLedgerOperationContext {
  latestDeviceResponse: null | Awaited<ReturnType<typeof getStacksAppVersion>>;
  awaitingDeviceConnection: boolean;
}

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

async function connectLedgerStacksApp() {
  const transport = await Transport.create();
  return new StacksApp(transport as any);
}

export async function getStacksAppVersion(app: StacksApp) {
  return app.getVersion();
}

interface PrepareLedgerDeviceConnectionArgs {
  setLoadingState(loadingState: boolean): void;
  onError(error?: Error): void;
}
export async function prepareLedgerDeviceStacksAppConnection(
  args: PrepareLedgerDeviceConnectionArgs
) {
  const { setLoadingState, onError } = args;
  setLoadingState(true);
  const [error, stacks] = await safeAwait(connectLedgerStacksApp());
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

const ledgerStacksAppVersionFromWhichJwtAuthIsSupported = '0.22.5';

export function doesLedgerStacksAppVersionSupportJwtAuth(versionInfo: SemVerObject) {
  return compare(
    ledgerStacksAppVersionFromWhichJwtAuthIsSupported,
    versionObjectToVersionString(versionInfo),
    '>'
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
