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
  AddressVersion,
} from '@stacks/transactions';
import { serializePayload } from '@stacks/transactions/dist/payload';

import { stxToMicroStx, validateStacksAddress } from '@app/common/stacks-utils';
import { stacksTransactionToHex, whenChainId } from '@app/common/transactions/transaction-utils';
import { currentNetworkState, currentStacksNetworkState } from '@app/store/network/networks';
import { currentAccountNonceState } from '@app/store/accounts/nonce';
import { currentAccountState, currentAccountStxAddressState } from '@app/store/accounts';
import { requestTokenPayloadState } from '@app/store/transactions/requests';
import { postConditionsState } from '@app/store/transactions/post-conditions';
import { localStacksTransactionInputsState } from '@app/store/transactions/local-transactions';
import { generateUnsignedTransaction } from '@app/common/transactions/generate-unsigned-txs';
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

export const unsignedStacksTransactionBaseState = atom(get => {
  const account = get(currentAccountState);
  const txData = get(pendingTransactionState);
  const stxAddress = get(currentAccountStxAddressState);
  const nonce = get(currentAccountNonceState);
  const customNonce = get(customNonceState);
  if (!account || !txData || !stxAddress || typeof nonce === 'undefined')
    return { transaction: undefined, options: {} };
  const txNonce = typeof customNonce === 'number' ? customNonce : nonce;
  if (
    txData.txType === TransactionTypes.ContractCall &&
    !validateStacksAddress(txData.contractAddress)
  ) {
    return { transaction: undefined, options: {} };
  }
  const publicKey = publicKeyToString(pubKeyfromPrivKey(account.stxPrivateKey));
  const options = {
    fee: txData.fee ?? 0,
    publicKey,
    nonce: txNonce,
    txData,
  };

  return generateUnsignedTransaction(options).then(transaction => ({ transaction, options }));
});

export const unsignedStacksTransactionState = atom(get => {
  const { transaction, options } = get(unsignedStacksTransactionBaseState);
  if (!transaction) return;
  return generateUnsignedTransaction({ ...options } as any);
});

export function prepareTxDetailsForBroadcast(tx: StacksTransaction) {
  const serialized = tx.serialize();
  const txRaw = stacksTransactionToHex(tx);

  return {
    serialized,
    isSponsored: tx.auth?.authType === AuthType.Sponsored,
    nonce: Number(tx.auth.spendingCondition?.nonce),
    fee: Number(tx.auth.spendingCondition?.fee),
    txRaw,
  };
}

export const unsignedTransactionState = atom(get => {
  const unsignedTransaction = get(unsignedStacksTransactionState);
  if (!unsignedTransaction) return;
  return prepareTxDetailsForBroadcast(unsignedTransaction);
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

export const addressNetworkVersionState = atom(get => {
  const chainId = get(currentNetworkState)?.chainId;
  return whenChainId(chainId)({
    [ChainID.Mainnet]: AddressVersion.MainnetSingleSig,
    [ChainID.Testnet]: AddressVersion.TestnetSingleSig,
  });
});

export const transactionBroadcastErrorState = atom<string | null>(null);

export const txByteSize = atom<number | null>(null);
