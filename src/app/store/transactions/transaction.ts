import { atom } from 'jotai';
import {
  AddressVersion,
  AuthType,
  ChainID,
  StacksTransaction,
  TransactionVersion,
} from '@stacks/transactions';

import { whenStxChainId } from '@app/common/utils';
import { stacksTransactionToHex } from '@app/common/transactions/stacks/transaction.utils';
import { currentNetworkAtom } from '@app/store/networks/networks';

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
  const chainId = get(currentNetworkAtom)?.chainId;

  const defaultChainId = TransactionVersion.Testnet;
  if (!chainId) return defaultChainId;

  return whenStxChainId(chainId)({
    [ChainID.Mainnet]: TransactionVersion.Mainnet,
    [ChainID.Testnet]: TransactionVersion.Testnet,
  });
});

export const addressNetworkVersionState = atom(get => {
  const chainId = get(currentNetworkAtom)?.chainId;
  return whenStxChainId(chainId)({
    [ChainID.Mainnet]: AddressVersion.MainnetSingleSig,
    [ChainID.Testnet]: AddressVersion.TestnetSingleSig,
  });
});
