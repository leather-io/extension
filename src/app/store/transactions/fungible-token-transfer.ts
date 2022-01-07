import { useAtomValue } from 'jotai/utils';
import {
  currentAccountBalancesUnanchoredState,
  currentAccountState,
  currentAccountStxAddressState,
} from '@app/store/accounts';
import { currentStacksNetworkState } from '@app/store/network/networks';
import { currentAccountNonceState } from '@app/store/accounts/nonce';
import { useSelectedAssetItem } from '@app/store/assets/asset.hooks';
import { useMemo } from 'react';

export function useMakeFungibleTokenTransfer() {
  const asset = useSelectedAssetItem();
  const currentAccount = useAtomValue(currentAccountState);
  const network = useAtomValue(currentStacksNetworkState);
  const balances = useAtomValue(currentAccountBalancesUnanchoredState);
  const stxAddress = useAtomValue(currentAccountStxAddressState);
  const nonce = useAtomValue(currentAccountNonceState);
  return useMemo(() => {
    if (!stxAddress || typeof nonce === 'undefined') return;

    if (asset && currentAccount && stxAddress) {
      const { contractName, contractAddress, name: assetName } = asset;
      return {
        asset,
        stxAddress,
        nonce,
        balances,
        network,
        assetName,
        contractAddress,
        contractName,
      };
    }
    return;
  }, [asset, balances, currentAccount, network, nonce, stxAddress]);
}
