import BN from 'bn.js';
import {
  STXTransferPayload,
  ContractCallPayload,
  ContractDeployPayload,
  TransactionTypes,
} from '@stacks/connect';
import {
  AnchorMode,
  ContractDeployOptions,
  deserializeCV,
  makeContractCall,
  makeContractDeploy,
  makeSTXTokenTransfer,
  SignedContractCallOptions,
  SignedTokenTransferOptions,
} from '@stacks/transactions';

import { hexToBuff } from '@common/utils';
import { getPostConditions } from '@common/transactions/post-condition-utils';

import { isTransactionTypeSupported } from './transaction-utils';

interface GenerateSignedTxArgs<TxPayload> {
  txData: TxPayload;
  senderKey: string;
  nonce?: number;
  fee?: number | string;
}

type GenerateSignedContractCallTxArgs = GenerateSignedTxArgs<ContractCallPayload>;

function generateSignedContractCallTx(args: GenerateSignedContractCallTxArgs) {
  const { txData, senderKey, nonce, fee } = args;
  const {
    contractName,
    contractAddress,
    functionName,
    functionArgs,
    sponsored,
    postConditionMode,
    postConditions,
  } = txData;

  const fnArgs = functionArgs.map(arg => deserializeCV(hexToBuff(arg)));

  const options: SignedContractCallOptions = {
    contractName,
    contractAddress,
    functionName,
    senderKey,
    anchorMode: AnchorMode.Any,
    functionArgs: fnArgs,
    nonce: nonce !== undefined ? new BN(nonce, 10) : undefined,
    fee: !fee ? new BN(0) : new BN(fee, 10),
    postConditionMode: postConditionMode,
    postConditions: getPostConditions(postConditions),
    network: txData.network,
    sponsored,
  };
  return makeContractCall(options);
}

type GenerateSignedContractDeployTxArgs = GenerateSignedTxArgs<ContractDeployPayload>;

function generateSignedContractDeployTx(args: GenerateSignedContractDeployTxArgs) {
  const { txData, senderKey, nonce, fee } = args;
  const { contractName, codeBody, network, postConditions, postConditionMode } = txData;
  const options: ContractDeployOptions = {
    contractName,
    codeBody,
    nonce: nonce !== undefined ? new BN(nonce, 10) : undefined,
    fee: !fee ? new BN(0) : new BN(fee, 10),
    senderKey,
    anchorMode: AnchorMode.Any,
    postConditionMode: postConditionMode,
    postConditions: getPostConditions(postConditions),
    network,
  };
  return makeContractDeploy(options);
}

type GenerateSignedStxTransferTxArgs = GenerateSignedTxArgs<STXTransferPayload>;

function generateSignedStxTransferTx(args: GenerateSignedStxTransferTxArgs) {
  const { txData, senderKey, nonce, fee } = args;
  const { recipient, memo, amount, network } = txData;
  const options: SignedTokenTransferOptions = {
    recipient,
    memo,
    senderKey,
    anchorMode: AnchorMode.Any,
    amount: new BN(amount),
    nonce: nonce !== undefined ? new BN(nonce, 10) : undefined,
    fee: !fee ? new BN(0) : new BN(fee, 10),
    network,
  };
  return makeSTXTokenTransfer(options);
}

export type GenerateSignedTransactionOptions = GenerateSignedTxArgs<
  ContractCallPayload | STXTransferPayload | ContractDeployPayload
>;
export async function generateSignedTransaction(options: GenerateSignedTransactionOptions) {
  const { txData, senderKey, nonce, fee = 0 } = options;
  const isValid = isTransactionTypeSupported(txData.txType);

  if (!isValid) throw new Error(`Invalid Transaction Type: ${txData.txType}`);

  switch (txData.txType) {
    case TransactionTypes.ContractCall:
      return generateSignedContractCallTx({ txData, senderKey, nonce, fee });
    case TransactionTypes.ContractDeploy:
      return generateSignedContractDeployTx({ txData, senderKey, nonce, fee });
    case TransactionTypes.STXTransfer:
      return generateSignedStxTransferTx({ txData, senderKey, nonce, fee });
    default:
      break;
  }
  throw new Error(`Could not sign transaction.`);
}
