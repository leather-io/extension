import { atomFamily } from 'jotai/utils';
import { ContractPrincipal, FtMeta } from '@common/asset-types';
import { atom } from 'jotai';
import { getLocalData, setLocalData } from '@common/store-utils';
import deepEqual from 'fast-deep-equal';
import { debugLabelWithContractPrincipal } from '@store/utils/atom-utils';
import { currentNetworkState } from '@store/network/networks';
import { apiClientState } from '@store/common/api-clients';
import { FungibleTokenMetadata } from '@stacks/blockchain-api-client';

enum FungibleTokensQueryKeys {
  FUNGIBLE_TOKEN_META_DATA = 'FUNGIBLE_TOKEN_META_DATA',
}

type ContractWithNetwork = Readonly<ContractPrincipal & { networkUrl: string }>;

export const fungibleTokenMetaDataState = atomFamily<
  [string, string],
  FungibleTokenMetadata | { error: string } | undefined
>(([contractId]) => {
  return atom(async get => {
    try {
      const { tokensApi } = get(apiClientState);
      const data = await tokensApi.getContractFtMetadata({
        contractId,
      });
      // can't return the promise directly
      return data;
    } catch (e: any) {
      try {
        const error: { error: string } = await e.json();
        return error;
      } catch (e) {
        return undefined;
      }
    }
  });
}, deepEqual);

export const assetMetaDataState = atomFamily<ContractWithNetwork, FtMeta | null>(
  ({ contractAddress, contractName, networkUrl }) => {
    const anAtom = atom(get => {
      const network = get(currentNetworkState);
      const keyParams = [
        network.url,
        contractAddress,
        contractName,
        FungibleTokensQueryKeys.FUNGIBLE_TOKEN_META_DATA,
      ];
      const localData = getLocalData<FtMeta | { error: string }>(keyParams);
      if (localData) {
        if ('error' in localData) return null;
        return localData;
      }
      const data = get(
        fungibleTokenMetaDataState([`${contractAddress}.${contractName}`, network.url])
      );
      if (!data) return null;
      if ('error' in data) {
        setLocalData<FtMeta | { error: string }>(keyParams, data);
        return null;
      }
      return setLocalData<FtMeta>(keyParams, {
        decimals: data.decimals,
        name: data.name,
        symbol: data.symbol,
        ftTrait: true,
      });
    });
    debugLabelWithContractPrincipal(anAtom, 'assetMetaDataState', {
      contractName,
      contractAddress,
      networkUrl,
    });
    return anAtom;
  },
  deepEqual
);
