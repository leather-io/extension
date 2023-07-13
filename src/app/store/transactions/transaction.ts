import {
  AddressVersion,
  AuthType,
  ChainID,
  StacksTransaction,
  TransactionVersion,
} from '@stacks/transactions';
import { atom } from 'jotai';

import { stacksTransactionToHex } from '@app/common/transactions/stacks/transaction.utils';
import { whenStacksChainId } from '@app/common/utils';
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
  const currentNetwork = get(currentNetworkAtom);

  if (!currentNetwork.chain.stacks.chainId) return TransactionVersion.Testnet; // default to testnet

  return whenStacksChainId(currentNetwork.chain.stacks.chainId)({
    [ChainID.Mainnet]: TransactionVersion.Mainnet,
    [ChainID.Testnet]: TransactionVersion.Testnet,
  });
});

export const addressNetworkVersionState = atom(get => {
  const currentNetwork = get(currentNetworkAtom);

  return whenStacksChainId(currentNetwork.chain.stacks.chainId)({
    [ChainID.Mainnet]: AddressVersion.MainnetSingleSig,
    [ChainID.Testnet]: AddressVersion.TestnetSingleSig,
  });
});
