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
import {
  CoinbaseTransaction,
  ContractCallTransaction,
  TransactionEventFungibleAsset,
} from '@stacks/stacks-blockchain-api-types';
import BigNumber from 'bignumber.js';
import { Tx } from '@common/api/transactions';
import { getContractName, truncateMiddle } from '@stacks/ui-utils';
import { AssetWithMeta } from '@common/asset-types';

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
    functionName,
    senderKey,
    anchorMode: AnchorMode.Any,
    functionArgs: args,
    nonce: nonce !== undefined ? new BN(nonce, 10) : undefined,
    fee: !fee ? new BN(0) : new BN(fee, 10),
    postConditionMode: postConditionMode,
    postConditions: getPostConditions(postConditions),
    network,
    sponsored,
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

export const isContractCallWithTokenTransfers = (tx: Tx) => {
  return (
    tx.tx_type === 'contract_call' &&
    tx.contract_call.function_name === 'transfer' &&
    tx.contract_call?.function_args?.[0]?.name === 'amount'
  );
};

// calculate the real amount of the token based on the decimal number
// specified in the corresponding token smart contract
export const calculateTokenTransferAmount = (
  asset: AssetWithMeta | undefined,
  tx: ContractCallTransaction
) => {
  if (!asset || !asset.meta) return;
  if (!isContractCallWithTokenTransfers(tx) || !tx.contract_call?.function_args) return;
  const val = tx.contract_call.function_args[0].repr.replace('u', '');
  const x = new BigNumber(val);
  if (!x.isFinite()) return;
  // Get the decimal number for this token
  const y = new BigNumber(asset.meta.decimals);
  // Exponentiation is unsafe here based on SIP-10 and clarity uint 128bits
  // https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md
  const decimalDivisor = new BigNumber(10).pow(y);
  if (!decimalDivisor.isFinite()) return;
  return x.dividedBy(decimalDivisor);
};

export const getAssetTransfer = (tx: Tx): TransactionEventFungibleAsset | null => {
  if (tx.tx_type !== 'contract_call') return null;
  if (tx.tx_status !== 'success') return null;
  return tx.events.find(
    event => event.event_type === 'fungible_token_asset'
  ) as TransactionEventFungibleAsset;
};

export const getTxCaption = (transaction: Tx) => {
  if (!transaction) return null;
  switch (transaction.tx_type) {
    case 'smart_contract':
      return truncateMiddle(transaction.smart_contract.contract_id, 4);
    case 'contract_call':
      return transaction.contract_call.contract_id.split('.')[1];
    case 'token_transfer':
    case 'coinbase':
    case 'poison_microblock':
      return truncateMiddle(transaction.tx_id, 4);
    default:
      return null;
  }
};

export const getTxTitle = (tx: Tx) => {
  switch (tx.tx_type) {
    case 'token_transfer':
      return 'Stacks Token';
    case 'contract_call':
      return tx.contract_call.function_name;
    case 'smart_contract':
      return getContractName(tx.smart_contract.contract_id);
    case 'coinbase':
      return `Coinbase ${(tx as CoinbaseTransaction).block_height}`;
    case 'poison_microblock':
      return 'Poison Microblock';
  }
};
