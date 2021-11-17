import BN from 'bn.js';
import {
  STXTransferPayload,
  ContractCallPayload,
  ContractDeployPayload,
  TransactionTypes,
} from '@stacks/connect';
import { ChainID } from '@stacks/common';

import {
  AnchorMode,
  deserializeCV,
  makeContractCall,
  makeContractDeploy,
  makeSTXTokenTransfer,
} from '@stacks/transactions';

import { hexToBuff } from '@common/utils';
import { getPostConditions } from '@common/transactions/post-condition-utils';

import {
  StacksMainnet,
  StacksTestnet,
  HIRO_MAINNET_DEFAULT,
  HIRO_TESTNET_DEFAULT,
} from '@stacks/network';

function isTransactionTypeSupported(txType: TransactionTypes) {
  return (
    txType === TransactionTypes.STXTransfer ||
    txType === TransactionTypes.ContractCall ||
    txType === TransactionTypes.ContractDeploy
  );
}

interface GenerateSignedContractCallTxArgs {
  txData: ContractCallPayload;
  senderKey: string;
  nonce?: number;
  fee?: number | null;
}
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

  let network = txData.network;

  if (typeof txData.network?.getTransferFeeEstimateApiUrl !== 'function') {
    const networkBuilder =
      txData.network?.chainId === ChainID.Testnet ? StacksTestnet : StacksMainnet;
    const defaultNetworkUrl =
      txData.network?.chainId === ChainID.Testnet ? HIRO_TESTNET_DEFAULT : HIRO_MAINNET_DEFAULT;
    network = new networkBuilder({ url: txData.network?.coreApiUrl || defaultNetworkUrl });
    if (txData.network?.bnsLookupUrl) network.bnsLookupUrl = txData.network?.bnsLookupUrl;
  }

  const options = {
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
    network,
    sponsored,
  };
  return makeContractCall(options);
}

interface GenerateSignedContractDeployTxArgs {
  txData: ContractDeployPayload;
  senderKey: string;
  nonce?: number;
  fee?: number | null;
}
function generateSignedContractDeployTx(args: GenerateSignedContractDeployTxArgs) {
  const { txData, senderKey, nonce, fee } = args;
  const { contractName, codeBody, network, postConditions, postConditionMode } = txData;
  const options = {
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

interface GenerateSignedStxTransferTxArgs {
  txData: STXTransferPayload;
  senderKey: string;
  nonce?: number;
  fee?: number | null;
}
function generateSignedStxTransferTx(args: GenerateSignedStxTransferTxArgs) {
  const { txData, senderKey, nonce, fee } = args;
  const { recipient, memo, amount, network } = txData;
  const options = {
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

export interface GenerateSignedTransactionOptions {
  txData: ContractCallPayload | STXTransferPayload | ContractDeployPayload;
  senderKey: string;
  nonce?: number;
  fee?: number | null;
}
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
