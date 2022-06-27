import { atom } from 'jotai';

import { TransactionTypes } from '@stacks/connect';
import {
  AuthType,
  ChainID,
  StacksTransaction,
  TransactionVersion,
  AddressVersion,
  serializePayload,
} from '@stacks/transactions';

import { validateStacksAddress } from '@app/common/stacks-utils';
import { stacksTransactionToHex, whenChainId } from '@app/common/transactions/transaction-utils';
import { currentNetworkState, currentStacksNetworkState } from '@app/store/network/networks';
import { currentAccountNonceState } from '@app/store/nonce/nonce';
import { currentAccountState, currentAccountStxAddressState } from '@app/store/accounts';
import { requestTokenPayloadState } from '@app/store/transactions/requests';
import { postConditionsState } from '@app/store/transactions/post-conditions';
import { generateUnsignedTransaction } from '@app/common/transactions/generate-unsigned-txs';

export const transactionAttachmentState = atom(get => get(requestTokenPayloadState)?.attachment);

export const unsignedStacksTransactionBaseState = atom(get => {
  const payload = get(requestTokenPayloadState);
  const postConditions = get(postConditionsState);
  const network = get(currentStacksNetworkState);
  const account = get(currentAccountState);
  const stxAddress = get(currentAccountStxAddressState);
  const nonce = get(currentAccountNonceState);

  if (!account || !payload || !stxAddress || typeof nonce === 'undefined')
    return { transaction: undefined, options: {} };
  if (
    payload.txType === TransactionTypes.ContractCall &&
    !validateStacksAddress(payload.contractAddress)
  ) {
    return { transaction: undefined, options: {} };
  }
  const options = {
    fee: 0,
    publicKey: account.stxPublicKey,
    nonce,
    txData: { ...payload, postConditions, network },
  };
  return generateUnsignedTransaction(options).then(transaction => ({ transaction, options }));
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
