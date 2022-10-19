import { BigNumber } from 'bignumber.js';

import { TransactionTypes } from '@stacks/connect';
import {
  addressFromVersionHash,
  AddressHashMode,
  addressHashModeToVersion,
  addressToString,
  AuthType,
  StacksTransaction,
  TransactionVersion,
} from '@stacks/transactions';
import {
  AddressTransactionWithTransfers,
  CoinbaseTransaction,
  MempoolTransaction,
  Transaction,
  TransactionEventFungibleAsset,
} from '@stacks/stacks-blockchain-api-types';
import { getContractName, truncateMiddle } from '@stacks/ui-utils';

import { displayDate, isoDateToLocalDateSafe, todaysIsoDate } from '@app/common/date-utils';
import { stacksValue } from '@app/common/stacks-utils';
import { bytesToHex } from '@stacks/common';

type Tx = MempoolTransaction | Transaction;

export interface SendFormValues {
  assetId: string;
  amount: number | string;
  fee: number | string;
  feeType: string;
  recipient: string;
  memo: string;
  nonce?: number | string;
}

export interface TransactionFormValues {
  fee: number | string;
  feeType: string;
  nonce?: number | string;
}

export interface StxTransfer {
  amount: string;
  sender?: string;
  recipient?: string;
}

export interface FtTransfer {
  asset_identifier: string;
  amount: string;
  sender?: string;
  recipient?: string;
}

export const stacksTransactionToHex = (transaction: StacksTransaction) =>
  `0x${bytesToHex(transaction.serialize())}`;

function txHasTime(tx: Tx) {
  return !!(
    ('burn_block_time_iso' in tx && tx.burn_block_time_iso) ||
    ('parent_burn_block_time_iso' in tx && tx.parent_burn_block_time_iso)
  );
}

export function isAddressTransactionWithTransfers(
  transaction: AddressTransactionWithTransfers | Tx
): transaction is AddressTransactionWithTransfers {
  return 'tx' in transaction;
}

function groupTxsByDateMap(txs: (AddressTransactionWithTransfers | MempoolTransaction)[]) {
  return txs.reduce((txsByDate, atx) => {
    const tx = isAddressTransactionWithTransfers(atx) ? atx.tx : atx;
    const time =
      ('burn_block_time_iso' in tx && tx.burn_block_time_iso) ||
      ('parent_burn_block_time_iso' in tx && tx.parent_burn_block_time_iso);
    const date = time ? isoDateToLocalDateSafe(time) : undefined;
    if (date && txHasTime(tx)) {
      if (!txsByDate.has(date)) {
        txsByDate.set(date, []);
      }
      txsByDate.set(date, [...(txsByDate.get(date) || []), atx]);
    }
    if (!txHasTime(tx)) {
      const today = todaysIsoDate();
      txsByDate.set(today, [...(txsByDate.get(today) || []), atx]);
    }
    return txsByDate;
  }, new Map<string, (AddressTransactionWithTransfers | MempoolTransaction)[]>());
}

function formatTxDateMapAsList(
  txMap: Map<string, (AddressTransactionWithTransfers | MempoolTransaction)[]>
) {
  return [...txMap.keys()].map(date => ({
    date,
    displayDate: displayDate(date),
    txs: txMap.get(date) ?? [],
  }));
}

function countTxIds(txs: (AddressTransactionWithTransfers | MempoolTransaction)[]) {
  return txs.reduce((acc, e) => {
    const txId = isAddressTransactionWithTransfers(e) ? e.tx.tx_id : e.tx_id;
    return acc.set(txId, (acc.get(txId) || 0) + 1);
  }, new Map());
}

function filterDuplicateTx(txs: (AddressTransactionWithTransfers | MempoolTransaction)[]) {
  const countOfTxIds = countTxIds(txs);

  return txs.filter(atx => {
    const tx = isAddressTransactionWithTransfers(atx) ? atx.tx : atx;
    const isDropped = tx.tx_status.includes('dropped');
    if (countOfTxIds.get(tx.tx_id) === 1 && !isDropped) return true;
    return tx.tx_status === 'success' || tx.tx_status.includes('abort');
  });
}

export function createTxDateFormatList(
  txs: (AddressTransactionWithTransfers | MempoolTransaction)[]
) {
  return formatTxDateMapAsList(groupTxsByDateMap(filterDuplicateTx(txs)));
}

export const getTxCaption = (transaction: Tx) => {
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

const getAssetTransfer = (tx: Tx): TransactionEventFungibleAsset | null => {
  if (tx.tx_type !== 'contract_call') return null;
  if (tx.tx_status !== 'success') return null;
  const transfer = tx.events.find(event => event.event_type === 'fungible_token_asset');
  if (transfer?.event_type !== 'fungible_token_asset') return null;
  return transfer;
};

export const getTxValue = (tx: Tx, isOriginator: boolean): number | string | null => {
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
