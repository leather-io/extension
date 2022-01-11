import BN from 'bn.js';
import {
  ContractCallPayload,
  ContractDeployPayload,
  STXTransferPayload,
  TransactionTypes,
} from '@stacks/connect';
import { hexToBuff } from '@common/utils';

import {
  AnchorMode,
  ChainID,
  deserializeCV,
  makeUnsignedContractCall,
  makeUnsignedSTXTokenTransfer,
} from '@stacks/transactions';
import { getPostConditions } from './post-condition-utils';
import { isTransactionTypeSupported, whenChainId } from './transaction-utils';
import {
  HIRO_MAINNET_DEFAULT,
  HIRO_TESTNET_DEFAULT,
  StacksMainnet,
  StacksTestnet,
} from '@stacks/network';

interface GenerateUnsignedTxArgs<TxPayload> {
  txData: TxPayload;
  publicKey: string;
  nonce?: number;
  fee?: number | string;
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
  } = txData;

  const fnArgs = functionArgs.map(arg => deserializeCV(hexToBuff(arg)));

  let network = txData.network || new StacksTestnet();

  const networkBuilder = whenChainId(network.chainId)({
    [ChainID.Mainnet]: StacksMainnet,
    [ChainID.Testnet]: StacksTestnet,
  });

  const defaultNetworkUrl = whenChainId(network.chainId)({
    [ChainID.Mainnet]: HIRO_MAINNET_DEFAULT,
    [ChainID.Testnet]: HIRO_TESTNET_DEFAULT,
  });

  network = new networkBuilder({ url: txData.network?.coreApiUrl || defaultNetworkUrl });
  if (txData.network?.bnsLookupUrl) network.bnsLookupUrl = txData.network?.bnsLookupUrl;

  const options = {
    contractName,
    contractAddress,
    functionName,
    publicKey,
    anchorMode: AnchorMode.Any,
    functionArgs: fnArgs,
    nonce: nonce !== undefined ? new BN(nonce, 10) : undefined,
    fee: !fee ? new BN(0) : new BN(fee, 10),
    postConditionMode: postConditionMode,
    postConditions: getPostConditions(postConditions),
    network,
    sponsored,
  };
  return makeUnsignedContractCall(options);
}

// type GenerateUnsignedContractDeployTxArgs = GenerateUnsignedTxArgs<>;
//   txData: ContractDeployPayload;
//   publicKey: string;
//   nonce?: number;
//   fee?: number | null;
// }
// function generateUnsignedContractDeployTx(args: GenerateUnsignedContractDeployTxArgs) {
//   const { txData, publicKey, nonce, fee } = args;
//   const { contractName, codeBody, network, postConditions, postConditionMode } = txData;
//   const options = {
//     contractName,
//     codeBody,
//     nonce: nonce !== undefined ? new BN(nonce, 10) : undefined,
//     fee: !fee ? new BN(0) : new BN(fee, 10),
//     publicKey,
//     anchorMode: AnchorMode.Any,
//     postConditionMode: postConditionMode,
//     postConditions: getPostConditions(postConditions),
//     network,
//   };
//   return makeUnsignedContractDeploy(options);
// }

type GenerateUnsignedStxTransferTxArgs = GenerateUnsignedTxArgs<STXTransferPayload>;

function generateUnsignedStxTransferTx(args: GenerateUnsignedStxTransferTxArgs) {
  const { txData, publicKey, nonce, fee } = args;
  const { recipient, memo, amount, network } = txData;
  const options = {
    recipient,
    memo,
    publicKey,
    anchorMode: AnchorMode.Any,
    amount: new BN(amount),
    nonce: nonce !== undefined ? new BN(nonce, 10) : undefined,
    fee: !fee ? new BN(0) : new BN(fee, 10),
    network,
  };
  return makeUnsignedSTXTokenTransfer(options);
}

type GenerateUnsignedTransactionOptions = GenerateUnsignedTxArgs<
  ContractCallPayload | STXTransferPayload | ContractDeployPayload
>;

export async function generateUnsignedTransaction(options: GenerateUnsignedTransactionOptions) {
  const { txData, publicKey, nonce, fee = 0 } = options;
  const isValid = isTransactionTypeSupported(txData.txType);

  if (!isValid) throw new Error(`Invalid Transaction Type: ${txData.txType}`);

  switch (txData.txType) {
    case TransactionTypes.ContractCall:
      return generateUnsignedContractCallTx({ txData, publicKey, nonce, fee });
    case TransactionTypes.ContractDeploy:
      // TODO: @kyranjamie
      // `makeUnsignedContractDeploy` is not exported from stacks.js
      // Coercing type for now while this isn't supported
      return generateUnsignedStxTransferTx({ txData: txData as any, publicKey, nonce, fee });
    case TransactionTypes.STXTransfer:
      return generateUnsignedStxTransferTx({ txData, publicKey, nonce, fee });
  }
}
