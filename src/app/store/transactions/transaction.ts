import { ChainID, TransactionVersion } from '@stacks/transactions';
import { atom } from 'jotai';

import { whenStacksChainId } from '@leather.io/stacks';

import { currentNetworkAtom } from '@app/store/networks/networks';

export const transactionNetworkVersionState = atom(get => {
  const currentNetwork = get(currentNetworkAtom);

  if (!currentNetwork.chain.stacks.chainId) return TransactionVersion.Testnet; // default to testnet

  return whenStacksChainId(currentNetwork.chain.stacks.chainId)({
    [ChainID.Mainnet]: TransactionVersion.Mainnet,
    [ChainID.Testnet]: TransactionVersion.Testnet,
  });
});
