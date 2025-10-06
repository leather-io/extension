import type { StacksNetwork } from '@stacks/network';
import {
  CoinbaseTransaction,
  TransactionEventFungibleAsset,
} from '@stacks/stacks-blockchain-api-types';
import {
  AddressHashMode,
  AuthType,
  ClarityType,
  type ContractCallPayload,
  type IntCV,
  StacksTransactionWire,
  type TokenTransferPayloadWire,
  addressFromVersionHash,
  addressHashModeToVersion,
  addressToString,
  createAddress,
  cvToString,
  deserializeMemoString,
  deserializeTransaction,
  isTokenTransferPayload,
  serializeCV,
} from '@stacks/transactions';
import { BigNumber } from 'bignumber.js';
import z from 'zod';

import { StacksTx, StacksTxStatus } from '@leather.io/models';
import { getStacksContractName } from '@leather.io/stacks';
import {
  createMoney,
  isDefined,
  removeTrailingNullCharacters,
  truncateMiddle,
} from '@leather.io/utils';

import { safeCall } from '@shared/utils';

import { stacksValue } from '@app/common/stacks-utils';
import { getStacksNetworkFromChainId } from '@app/store/networks/networks.hooks';

export function statusFromTx(tx: StacksTx): StacksTxStatus {
  const { tx_status } = tx;
  if (tx_status === 'pending') return 'pending';
  if (tx_status === 'success') return 'success';
  return 'failed';
}

export function stacksTransactionToHex(transaction: StacksTransactionWire) {
  return `0x${transaction.serialize()}`;
}

export function getTxCaption(transaction: StacksTx) {
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
}

function getAssetTransfer(tx: StacksTx): TransactionEventFungibleAsset | null {
  if (tx.tx_type !== 'contract_call') return null;
  if (tx.tx_status !== 'success') return null;
  const transfer = tx.events.find(event => event.event_type === 'fungible_token_asset');
  if (transfer?.event_type !== 'fungible_token_asset') return null;
  return transfer;
}

export function getTxValue(tx: StacksTx, isOriginator: boolean): number | string | null {
  if (tx.tx_type === 'token_transfer') {
    return `${isOriginator ? '-' : ''}${stacksValue({
      value: tx.token_transfer.amount,
      withTicker: false,
    })}`;
  }
  const transfer = getAssetTransfer(tx);
  if (transfer) return new BigNumber(transfer.asset.amount).toFormat();
  return null;
}

export function getTxTitle(tx: StacksTx) {
  switch (tx.tx_type) {
    case 'token_transfer':
      return 'Stacks';
    case 'contract_call':
      return tx.contract_call.function_name;
    case 'smart_contract':
      return getStacksContractName(tx.smart_contract.contract_id);
    case 'coinbase':
      return `Coinbase ${(tx as CoinbaseTransaction).block_height}`;
    case 'poison_microblock':
      return 'Poison Microblock';
    default:
      return '';
  }
}

// calculate the real amount of the token based on the decimal number
// specified in the corresponding token smart contract
export function calculateTokenTransferAmount(
  decimals: number,
  amount: number | string | BigNumber
) {
  return new BigNumber(amount).shiftedBy(-decimals);
}

export function isTxSponsored(tx: StacksTransactionWire) {
  return tx.auth.authType === AuthType.Sponsored;
}

function getAddressFromPublicKeyHash(
  publicKeyHash: Buffer,
  hashMode: AddressHashMode,
  network: StacksNetwork
): string {
  const addrVer = addressHashModeToVersion(hashMode, network);
  if (publicKeyHash.length !== 20) {
    throw new Error('expected 20-byte pubkeyhash');
  }
  const addr = addressFromVersionHash(addrVer, publicKeyHash.toString('hex'));
  return addressToString(addr);
}

export function getTxSenderAddress(tx: StacksTransactionWire): string | undefined {
  if (!tx?.auth?.spendingCondition?.signer) return;
  const txSender = getAddressFromPublicKeyHash(
    Buffer.from(tx.auth.spendingCondition.signer, 'hex'),
    tx.auth.spendingCondition.hashMode as number,
    getStacksNetworkFromChainId(tx.chainId)
  );
  return txSender;
}

export function isPendingTx(tx: StacksTx) {
  return tx.tx_status === 'pending';
}

export enum StacksTransactionActionType {
  Cancel = 'cancel',
  IncreaseFee = 'increase-fee',
  RpcRequest = 'rpc-request',
}

export function getRecipientFromStacksTransaction(transaction: StacksTransactionWire) {
  if (isTokenTransferPayload(transaction.payload)) {
    return cvToString(transaction.payload.recipient);
  }

  if (isSip10TransferContactCall(transaction)) {
    const sip10RecipientArg = transaction.payload.functionArgs?.[2];
    if (!sip10RecipientArg) return null;
    const [result] = safeCall(() => cvToString(sip10RecipientArg));
    return result;
  }

  return null;
}

export function getTokenTransferAmount(payload: TokenTransferPayloadWire) {
  return createMoney(Number(payload.amount), 'STX');
}

export function getTokenTransferMemoDisplayText(payload: TokenTransferPayloadWire) {
  return removeTrailingNullCharacters(payload.memo.content);
}

export function getStacksTransactionFee(tx: StacksTransactionWire) {
  return createMoney(Number(tx.auth.spendingCondition.fee), 'STX');
}

export function getNonceFromStacksTransaction(tx: StacksTransactionWire) {
  return Number(tx.auth.spendingCondition.nonce);
}

export function getSip10TransferAmount(
  payload: ContractCallPayload,
  symbol: string,
  decimals: number
) {
  const amount = new BigNumber(Number((payload.functionArgs?.[0] as IntCV).value));
  return createMoney(amount, symbol.toUpperCase(), decimals);
}

export function isSip10TransferContactCall(
  tx: StacksTransactionWire
): tx is StacksTransactionWire & { payload: ContractCallPayload } {
  if (!tx.payload || !('functionName' in tx.payload)) return false;
  const payload = tx.payload;
  return (
    payload.functionName.content === 'transfer' &&
    (payload.functionArgs.length === 3 || payload.functionArgs.length === 4)
  );
}

export function getSip10MemoDisplayText(payload: ContractCallPayload) {
  if (!isDefined(payload.functionArgs[3])) return null;
  const isSome = payload.functionArgs[3].type === ClarityType.OptionalSome;
  return isSome ? deserializeMemoString(serializeCV(payload.functionArgs[3])).content : null;
}

function isValidEncodedTransaction(tx: string | Uint8Array) {
  const [result, error] = safeCall(() => deserializeTransaction(tx));
  return !!result && !error;
}

export const hexEncodedStacksTxSchema = z
  .string()
  .refine(value => isValidEncodedTransaction(value), {
    message: 'Invalid hex-encoded Stacks transaction',
  });

export function getContractAddressFromContractCallPayload(payload: ContractCallPayload) {
  const contractAddress = addressToString(payload.contractAddress);
  const contractName = payload.contractName.content;
  return [contractAddress, contractName].join('.');
}

export function safeAddressToString(address: string) {
  try {
    return addressToString(createAddress(address));
  } catch (error) {
    return null;
  }
}
