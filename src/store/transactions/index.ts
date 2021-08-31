import { atom } from 'jotai';

import { AuthType, ChainID, TransactionVersion } from '@stacks/transactions';

import { currentNetworkState, currentStacksNetworkState } from '@store/network/networks';
import { currentAccountNonceState } from '@store/accounts/nonce';
import { currentAccountState, currentAccountStxAddressState } from '@store/accounts';
import { requestTokenPayloadState } from '@store/transactions/requests';

import { generateSignedTransaction } from '@common/transactions/transactions';
import { TransactionPayload, TransactionTypes } from '@stacks/connect';
import { stacksTransactionToHex } from '@common/transactions/transaction-utils';
import { postConditionsState } from '@store/transactions/post-conditions';
import { validateStacksAddress } from '@common/stacks-utils';

import { getUpdatedTransactionFee } from '@store/transactions/utils';
import { currentFeeRateState } from '@store/transactions/fees';
import { localTransactionState } from '@store/transactions/local-transactions';
import { customNonceState } from './nonce.hooks';

export const pendingTransactionState = atom(get => {
  const payload = get(requestTokenPayloadState);
  const postConditions = get(postConditionsState);
  const network = get(currentStacksNetworkState);

  if (!payload) return;
  return { ...payload, postConditions, network };
});

export const transactionAttachmentState = atom(get => get(pendingTransactionState)?.attachment);

export const signedStacksTransactionBaseState = atom(get => {
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
  )
    return { transaction: undefined, options: {} };
  const options = {
    senderKey: account.stxPrivateKey,
    nonce: txNonce,
    txData: txData as any,
  };
  return generateSignedTransaction(options).then(transaction => {
    return { transaction, options };
  });
});

export const signedStacksTransactionState = atom(get => {
  const { transaction, options } = get(signedStacksTransactionBaseState);
  if (!transaction) return;
  const fee = getUpdatedTransactionFee(transaction, get(currentFeeRateState));
  return generateSignedTransaction({ ...options, fee: fee.toNumber() });
});

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

export const transactionNetworkVersionState = atom(get =>
  get(currentNetworkState)?.chainId === ChainID.Mainnet
    ? TransactionVersion.Mainnet
    : TransactionVersion.Testnet
);

export type TransactionPayloadWithAttachment = TransactionPayload & {
  attachment?: string;
};
export const isUnauthorizedTransactionState = atom<boolean>(false);
export const transactionBroadcastErrorState = atom<string | null>(null);

export const txForSettingsState = atom(get =>
  get(pendingTransactionState) ? get(signedStacksTransactionState) : get(localTransactionState)
);

export const txByteSize = atom<number | null>(null);

// dev tooling
postConditionsState.debugLabel = 'postConditionsState';
pendingTransactionState.debugLabel = 'pendingTransactionState';
transactionAttachmentState.debugLabel = 'transactionAttachmentState';
signedStacksTransactionState.debugLabel = 'signedStacksTransactionState';
signedTransactionState.debugLabel = 'signedTransactionState';
transactionNetworkVersionState.debugLabel = 'transactionNetworkVersionState';
isUnauthorizedTransactionState.debugLabel = 'isUnauthorizedTransactionState';
transactionBroadcastErrorState.debugLabel = 'transactionBroadcastErrorState';
