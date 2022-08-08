import { atom } from 'jotai';

import {
  AuthType,
  ChainID,
  StacksTransaction,
  TransactionVersion,
  AddressVersion,
} from '@stacks/transactions';

import { stacksTransactionToHex, whenChainId } from '@app/common/transactions/transaction-utils';
import { currentNetworkState } from '@app/store/network/networks';

export function prepareTxDetailsForBroadcast(tx: StacksTransaction) {
  const serialized = tx.serialize();
  const txRaw = stacksTransactionToHex(tx);

  return {
    serialized,
    isSponsored: tx.auth?.authType === AuthType.Sponsored,
    txRaw,
  };
}

export const transactionNetworkVersionState = atom(get => {
  const chainId = get(currentNetworkState)?.chainId;

  const defaultChainId = TransactionVersion.Testnet;
  if (!chainId) return defaultChainId;

  return whenChainId(chainId)({
    [ChainID.Mainnet]: TransactionVersion.Mainnet,
    [ChainID.Testnet]: TransactionVersion.Testnet,
  });
});

export const addressNetworkVersionState = atom(get => {
  const chainId = get(currentNetworkState)?.chainId;
  return whenChainId(chainId)({
    [ChainID.Mainnet]: AddressVersion.MainnetSingleSig,
    [ChainID.Testnet]: AddressVersion.TestnetSingleSig,
  });
});

export const transactionBroadcastErrorState = atom<string | null>(null);
