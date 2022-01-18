import { atom } from 'jotai';
import { selectedAssetStore } from '@app/store/assets/asset-search';
import {
  currentAccountBalancesUnanchoredState,
  currentAccountState,
  currentAccountStxAddressState,
} from '@app/store/accounts';
import { currentStacksNetworkState } from '@app/store/network/networks';
import { currentAccountNonceState } from '@app/store/accounts/nonce';

export const makeFungibleTokenTransferState = atom(get => {
  const asset = get(selectedAssetStore);
  const currentAccount = get(currentAccountState);
  const network = get(currentStacksNetworkState);
  const balances = get(currentAccountBalancesUnanchoredState);
  const stxAddress = get(currentAccountStxAddressState);
  const nonce = get(currentAccountNonceState);
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
});
