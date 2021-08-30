import {
  AnchorMode,
  deserializeCV,
  makeContractCall,
  makeContractDeploy,
  makeSTXTokenTransfer,
  StacksTransaction,
} from '@stacks/transactions';
import BN from 'bn.js';
import { getPostConditions } from '@common/transactions/postcondition-utils';
import { ChainID } from '@stacks/common';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import {
  ContractCallOptions,
  ContractDeployOptions,
  TokenTransferOptions,
} from '@common/transactions/transactions';
import { isNumber, isString } from '@common/utils';

export const generateContractCallTx = ({
  txData,
  senderKey,
  nonce,
  fee,
}: {
  txData: ContractCallOptions;
  senderKey: string;
  nonce?: number;
  fee?: number;
}) => {
  const {
    contractName,
    contractAddress,
    functionName,
    functionArgs,
    sponsored,
    postConditionMode,
    postConditions,
  } = txData;
  const isValidFee = isNumber(txData.fee) || isString(txData.fee);
  const args = functionArgs.map(arg => {
    return deserializeCV(Buffer.from(arg, 'hex'));
  });

  let network = txData.network;

  if (typeof txData.network?.getTransferFeeEstimateApiUrl !== 'function') {
    const Builder = txData.network?.chainId === ChainID.Testnet ? StacksTestnet : StacksMainnet;
    network = new Builder();
    if (txData.network?.coreApiUrl) network.coreApiUrl = txData.network?.coreApiUrl;
    if (txData.network?.bnsLookupUrl) network.bnsLookupUrl = txData.network?.bnsLookupUrl;
  }

  const options = {
    contractName,
    contractAddress,
    fee: txData.fee !== undefined && isValidFee ? new BN(txData.fee) : undefined,
    functionName,
    senderKey,
    anchorMode: AnchorMode.Any,
    functionArgs: args,
    nonce: nonce !== undefined ? new BN(nonce, 10) : undefined,
    postConditionMode: postConditionMode,
    postConditions: getPostConditions(postConditions),
    network,
    sponsored,
    fee: !fee ? new BN(0) : new BN(fee, 10),
  };
  return makeContractCall(options);
};

export const generateContractDeployTx = ({
  txData,
  senderKey,
  nonce,
  fee,
}: {
  txData: ContractDeployOptions;
  senderKey: string;
  nonce?: number;
  fee?: number;
}) => {
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
};

export const generateSTXTransferTx = ({
  txData,
  senderKey,
  nonce,
  fee,
}: {
  txData: TokenTransferOptions;
  senderKey: string;
  nonce?: number;
  fee?: number;
}) => {
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
};

export const stacksTransactionToHex = (transaction: StacksTransaction) =>
  `0x${transaction.serialize().toString('hex')}`;
