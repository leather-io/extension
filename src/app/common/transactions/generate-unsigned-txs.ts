import BN from 'bn.js';
import {
  ContractCallPayload,
  ContractDeployPayload,
  STXTransferPayload,
  TransactionTypes,
} from '@stacks/connect';
import {
  AnchorMode,
  deserializeCV,
  makeUnsignedContractCall,
  makeUnsignedSTXTokenTransfer,
  makeUnsignedContractDeploy,
} from '@stacks/transactions';

import { hexToBuff } from '@app/common/utils';
import { getPostConditions } from './post-condition-utils';
import { isTransactionTypeSupported } from './transaction-utils';

function initNonce(nonce?: number) {
  return nonce !== undefined ? new BN(nonce, 10) : undefined;
}

interface GenerateUnsignedTxArgs<TxPayload> {
  txData: TxPayload;
  publicKey: string;
  fee: number | string;
  nonce?: number;
}

type GenerateUnsignedContractCallTxArgs = GenerateUnsignedTxArgs<ContractCallPayload>;

function generateUnsignedContractCallTx(args: GenerateUnsignedContractCallTxArgs) {
  const { txData, publicKey, nonce, fee } = args;
  const {
    contractName,
    contractAddress,
    functionName,
    functionArgs,
    sponsored,
    postConditionMode,
    postConditions,
    network,
    anchorMode,
  } = txData;

  const fnArgs = functionArgs.map(arg => deserializeCV(hexToBuff(arg)));

  const options = {
    contractName,
    contractAddress,
    functionName,
    publicKey,
    anchorMode: anchorMode ?? AnchorMode.Any,
    functionArgs: fnArgs,
    nonce: initNonce(nonce),
    fee: new BN(fee, 10),
    postConditionMode: postConditionMode,
    postConditions: getPostConditions(postConditions),
    network,
    sponsored,
  };
  return makeUnsignedContractCall(options);
}

type GenerateUnsignedContractDeployTxArgs = GenerateUnsignedTxArgs<ContractDeployPayload>;

function generateUnsignedContractDeployTx(args: GenerateUnsignedContractDeployTxArgs) {
  const { txData, publicKey, nonce, fee } = args;
  const { contractName, codeBody, network, postConditions, postConditionMode, anchorMode } = txData;
  const options = {
    contractName,
    codeBody,
    nonce: initNonce(nonce),
    fee: new BN(fee, 10),
    publicKey,
    anchorMode: anchorMode ?? AnchorMode.Any,
    postConditionMode: postConditionMode,
    postConditions: getPostConditions(postConditions),
    network,
  };
  return makeUnsignedContractDeploy(options);
}

type GenerateUnsignedStxTransferTxArgs = GenerateUnsignedTxArgs<STXTransferPayload>;

function generateUnsignedStxTransferTx(args: GenerateUnsignedStxTransferTxArgs) {
  const { txData, publicKey, nonce, fee } = args;
  const { recipient, memo, amount, network, anchorMode } = txData;
  const options = {
    recipient,
    memo,
    publicKey,
    anchorMode: anchorMode ?? AnchorMode.Any,
    amount: new BN(amount),
    nonce: initNonce(nonce),
    fee: new BN(fee, 10),
    network,
  };
  return makeUnsignedSTXTokenTransfer(options);
}

export type GenerateUnsignedTransactionOptions = GenerateUnsignedTxArgs<
  ContractCallPayload | STXTransferPayload | ContractDeployPayload
>;
export async function generateUnsignedTransaction(options: GenerateUnsignedTransactionOptions) {
  const { txData, publicKey, nonce, fee } = options;
  const isValid = isTransactionTypeSupported(txData.txType);

  if (!isValid) throw new Error(`Invalid Transaction Type: ${txData.txType}`);

  switch (txData.txType) {
    case TransactionTypes.STXTransfer:
      return generateUnsignedStxTransferTx({ txData, publicKey, nonce, fee });
    case TransactionTypes.ContractCall:
      return generateUnsignedContractCallTx({ txData, publicKey, nonce, fee });
    case TransactionTypes.ContractDeploy:
      return generateUnsignedContractDeployTx({ txData, publicKey, nonce, fee });
  }
}
