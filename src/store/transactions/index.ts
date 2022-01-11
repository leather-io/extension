import { atom } from 'jotai';

import {
  ContractCallPayload,
  ContractDeployPayload,
  STXTransferPayload,
  TransactionTypes,
} from '@stacks/connect';
import {
  AuthType,
  ChainID,
  pubKeyfromPrivKey,
  StacksTransaction,
  TransactionVersion,
  publicKeyToString,
} from '@stacks/transactions';
import { serializePayload } from '@stacks/transactions/dist/payload';

import { stxToMicroStx, validateStacksAddress } from '@common/stacks-utils';
import { generateSignedTransaction } from '@common/transactions/generate-signed-txs';
import { stacksTransactionToHex, whenChainId } from '@common/transactions/transaction-utils';
import { currentNetworkState, currentStacksNetworkState } from '@store/network/networks';
import { currentAccountNonceState } from '@store/accounts/nonce';
import { currentAccountState, currentAccountStxAddressState } from '@store/accounts';
import { requestTokenPayloadState } from '@store/transactions/requests';
import { postConditionsState } from '@store/transactions/post-conditions';
import { localStacksTransactionInputsState } from '@store/transactions/local-transactions';
import { localTransactionState } from '@store/transactions/local-transactions';
import { generateUnsignedTransaction } from '@common/transactions/generate-unsigned-txs';

import { customNonceState } from './nonce.hooks';

export const pendingTransactionState = atom<
  ContractCallPayload | ContractDeployPayload | STXTransferPayload | undefined
>(get => {
  const payload = get(requestTokenPayloadState);
  const postConditions = get(postConditionsState);
  const network = get(currentStacksNetworkState);
  const txData = get(localStacksTransactionInputsState);
  if (!payload) return;
  payload.fee = stxToMicroStx(txData?.fee || 0).toNumber();

  return { ...payload, postConditions, network };
});

export const transactionAttachmentState = atom(get => get(pendingTransactionState)?.attachment);

/** @deprecated */
const signedStacksTransactionBaseState = atom(get => {
  const account = get(currentAccountState);
  const txData = get(pendingTransactionState);
  const stxAddress = get(currentAccountStxAddressState);
  const nonce = get(currentAccountNonceState);
  const customNonce = get(customNonceState);
  if (!account || !txData || !stxAddress || typeof nonce === 'undefined') return;
  const txNonce = typeof customNonce === 'number' ? customNonce : nonce;
  if (
    txData.txType === TransactionTypes.ContractCall &&
    !validateStacksAddress(txData.contractAddress)
  ) {
    return { transaction: undefined, options: {} };
  }
  const options = {
    fee: txData.fee,
    senderKey: account.stxPrivateKey,
    nonce: txNonce,
    txData,
  };
  return generateSignedTransaction(options).then(transaction => ({ transaction, options }));
});

const unsignedStacksTransactionBaseState = atom(get => {
  const account = get(currentAccountState);
  const txData = get(pendingTransactionState);
  const stxAddress = get(currentAccountStxAddressState);
  const nonce = get(currentAccountNonceState);
  const customNonce = get(customNonceState);
  if (!account || !txData || !stxAddress || typeof nonce === 'undefined') return;
  const txNonce = typeof customNonce === 'number' ? customNonce : nonce;
  if (
    txData.txType === TransactionTypes.ContractCall &&
    !validateStacksAddress(txData.contractAddress)
  ) {
    return { transaction: undefined, options: {} };
  }
  const publicKey = publicKeyToString(pubKeyfromPrivKey(account.stxPrivateKey));
  const options = {
    fee: txData.fee,
    publicKey,
    nonce: txNonce,
    txData,
  };
  return generateUnsignedTransaction(options).then(transaction => ({ transaction, options }));
});

/** @deprecated */
const signedStacksTransactionState = atom(get => {
  const { transaction, options } = get(signedStacksTransactionBaseState);
  if (!transaction) return;
  return generateSignedTransaction({ ...options });
});

const unsignedStacksTransactionState = atom(get => {
  const { transaction, options } = get(unsignedStacksTransactionBaseState);
  if (!transaction) return;
  return generateUnsignedTransaction({ ...options });
});

/** @deprecated */
export const signedTransactionState = atom(get => {
  const signedTransaction = get(signedStacksTransactionState);
  if (!signedTransaction) return;
  const serialized = signedTransaction.serialize();
  const txRaw = stacksTransactionToHex(signedTransaction);
  return {
    serialized,
    isSponsored: signedTransaction?.auth?.authType === AuthType.Sponsored,
    nonce: signedTransaction?.auth.spendingCondition?.nonce.toNumber(),
    fee: signedTransaction?.auth.spendingCondition?.fee?.toNumber(),
    txRaw,
  };
});

export const unsignedTransactionState = atom(get => {
  const unsignedTransaction = get(unsignedStacksTransactionState);
  if (!unsignedTransaction) return;
  const serialized = unsignedTransaction.serialize();
  const txRaw = stacksTransactionToHex(unsignedTransaction);
  return {
    serialized,
    isSponsored: unsignedTransaction?.auth?.authType === AuthType.Sponsored,
    nonce: unsignedTransaction?.auth.spendingCondition?.nonce.toNumber(),
    fee: unsignedTransaction?.auth.spendingCondition?.fee?.toNumber(),
    txRaw,
  };
});

export const serializedUnsignedTransactionPayloadState = atom<string>(get => {
  const { transaction } = get(unsignedStacksTransactionBaseState);
  if (!transaction) return '';
  const serializedTxPayload = serializePayload((transaction as StacksTransaction).payload);
  return serializedTxPayload.toString('hex');
});

export const estimatedUnsignedTransactionByteLengthState = atom<number | null>(get => {
  const { transaction } = get(unsignedStacksTransactionBaseState);
  if (!transaction) return null;
  const serializedTx = (transaction as StacksTransaction).serialize();
  return serializedTx.byteLength;
});

export const transactionNetworkVersionState = atom(get => {
  const chainId = get(currentNetworkState)?.chainId;

  const defaultChainId = TransactionVersion.Testnet;
  if (!chainId) return defaultChainId;

  return whenChainId(chainId)({
    [ChainID.Mainnet]: TransactionVersion.Mainnet,
    [ChainID.Testnet]: TransactionVersion.Testnet,
  });
});

export const transactionBroadcastErrorState = atom<string | null>(null);

// TODO: consider alternatives
// Implicitly selecting a tx based on `pendingTransactionState`s value seems
// like it could easily be error-prone. Say this value doesn't get reset when it should.
// The effect could be calamitous. A user would be changing settings for a stale, cached
// transaction they've long forgotten about.
export const txForSettingsState = atom(get =>
  get(pendingTransactionState) ? get(signedStacksTransactionState) : get(localTransactionState)
);

// Using txForSettingsState which should be refactored
// with new transaction signing flow.
export const serializedTransactionPayloadState = atom<string>(get => {
  const transaction = get(txForSettingsState);
  if (!transaction) return '';
  const serializedTxPayload = serializePayload(transaction.payload);
  return serializedTxPayload.toString('hex');
});

// Using txForSettingsState which should be refactored
// with new transaction signing flow.
export const estimatedTransactionByteLengthState = atom<number | null>(get => {
  const transaction = get(txForSettingsState);
  if (!transaction) return null;
  const serializedTx = transaction.serialize();
  return serializedTx.byteLength;
});

export const txByteSize = atom<number | null>(null);

// dev tooling
postConditionsState.debugLabel = 'postConditionsState';
pendingTransactionState.debugLabel = 'pendingTransactionState';
transactionAttachmentState.debugLabel = 'transactionAttachmentState';
signedStacksTransactionState.debugLabel = 'signedStacksTransactionState';
signedTransactionState.debugLabel = 'signedTransactionState';
transactionNetworkVersionState.debugLabel = 'transactionNetworkVersionState';
transactionBroadcastErrorState.debugLabel = 'transactionBroadcastErrorState';
