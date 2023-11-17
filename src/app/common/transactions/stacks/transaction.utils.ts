import { bytesToHex } from '@stacks/common';
import { TransactionTypes } from '@stacks/connect';
import {
  CoinbaseTransaction,
  NetworkBlockTimesResponse,
  TransactionEventFungibleAsset,
} from '@stacks/stacks-blockchain-api-types';
import {
  AddressHashMode,
  AuthType,
  StacksTransaction,
  TransactionVersion,
  addressFromVersionHash,
  addressHashModeToVersion,
  addressToString,
} from '@stacks/transactions';
import { BigNumber } from 'bignumber.js';

import { StacksTx, StacksTxStatus } from '@shared/models/transactions/stacks-transaction.model';

import { stacksValue } from '@app/common/stacks-utils';
import { getContractName } from '@app/ui/utils/get-contract-name';
import { truncateMiddle } from '@app/ui/utils/truncate-middle';

export const statusFromTx = (tx: StacksTx): StacksTxStatus => {
  const { tx_status } = tx;
  if (tx_status === 'pending') return 'pending';
  if (tx_status === 'success')
    return 'is_unanchored' in tx && tx.is_unanchored
      ? 'success_microblock'
      : 'success_anchor_block';
  return 'failed';
};

export const stacksTransactionToHex = (transaction: StacksTransaction) =>
  `0x${bytesToHex(transaction.serialize())}`;

export const getTxCaption = (transaction: StacksTx) => {
  switch (transaction.tx_type) {
    case 'smart_contract':
      return truncateMiddle(transaction.smart_contract.contract_id.split('.')[0], 4);
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

const getAssetTransfer = (tx: StacksTx): TransactionEventFungibleAsset | null => {
  if (tx.tx_type !== 'contract_call') return null;
  if (tx.tx_status !== 'success') return null;
  const transfer = tx.events.find(event => event.event_type === 'fungible_token_asset');
  if (transfer?.event_type !== 'fungible_token_asset') return null;
  return transfer;
};

export const getTxValue = (tx: StacksTx, isOriginator: boolean): number | string | null => {
  if (tx.tx_type === 'token_transfer') {
    return `${isOriginator ? '-' : ''}${stacksValue({
      value: tx.token_transfer.amount,
      withTicker: false,
    })}`;
  }
  const transfer = getAssetTransfer(tx);
  if (transfer) return new BigNumber(transfer.asset.amount).toFormat();
  return null;
};

export const getTxTitle = (tx: StacksTx) => {
  switch (tx.tx_type) {
    case 'token_transfer':
      return 'Stacks';
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

// calculate the real amount of the token based on the decimal number
// specified in the corresponding token smart contract
export const calculateTokenTransferAmount = (
  decimals: number,
  amount: number | string | BigNumber
) => {
  return new BigNumber(amount).shiftedBy(-decimals);
};

export function isTransactionTypeSupported(txType: TransactionTypes) {
  return (
    txType === TransactionTypes.STXTransfer ||
    txType === TransactionTypes.ContractCall ||
    txType === TransactionTypes.ContractDeploy
  );
}

export function isTxSponsored(tx: StacksTransaction) {
  return tx.auth.authType === AuthType.Sponsored;
}

function getAddressFromPublicKeyHash(
  publicKeyHash: Buffer,
  hashMode: AddressHashMode,
  transactionVersion: TransactionVersion
): string {
  const addrVer = addressHashModeToVersion(hashMode, transactionVersion);
  if (publicKeyHash.length !== 20) {
    throw new Error('expected 20-byte pubkeyhash');
  }
  const addr = addressFromVersionHash(addrVer, publicKeyHash.toString('hex'));
  return addressToString(addr);
}

export function getTxSenderAddress(tx: StacksTransaction): string | undefined {
  if (!tx?.auth?.spendingCondition?.signer) return;
  const txSender = getAddressFromPublicKeyHash(
    Buffer.from(tx.auth.spendingCondition.signer, 'hex'),
    tx.auth.spendingCondition.hashMode as number,
    tx.version
  );
  return txSender;
}

export function getEstimatedConfirmationTime(
  isTestnet: boolean,
  blockTime?: NetworkBlockTimesResponse
) {
  const arrivesIn = isTestnet
    ? blockTime?.testnet.target_block_time
    : blockTime?.mainnet.target_block_time;

  if (!arrivesIn) return '~10 – 20 min';

  return `~${arrivesIn / 60} min`;
}

export function isPendingTx(tx: StacksTx) {
  return tx.tx_status === 'pending';
}
