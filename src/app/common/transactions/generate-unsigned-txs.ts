import BN from 'bn.js';
import {
  ContractCallPayload as ConnectContractCallPayload,
  ContractDeployPayload as ConnectContractDeployPayload,
  STXTransferPayload as ConnectSTXTransferPayload,
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
import { StacksNetwork } from '@stacks/network';

function initNonce(nonce?: number) {
  return nonce !== undefined ? new BN(nonce, 10) : undefined;
}

// This type exists to bridge the gap while @stacks/connect uses an outdated
// version of @stacks/network
interface TempCorrectNetworkPackageType {
  network?: StacksNetwork;
}

interface GenerateUnsignedTxArgs<TxPayload> {
  txData: TxPayload;
  publicKey: string;
  fee: number | string;
  nonce?: number;
}

export type ContractCallPayload = Omit<ConnectContractCallPayload, 'network'> &
  TempCorrectNetworkPackageType;
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

export type ContractDeployPayload = Omit<ConnectContractDeployPayload, 'network'> &
  TempCorrectNetworkPackageType;
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

export type STXTransferPayload = Omit<ConnectSTXTransferPayload, 'network'> &
  TempCorrectNetworkPackageType;
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
