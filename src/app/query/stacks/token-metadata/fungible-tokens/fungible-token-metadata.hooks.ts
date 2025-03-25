import { useQueries } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';

import {
  type AddressBalanceResponse,
  type FtAssetResponse,
  createGetFungibleTokenMetadataQueryOptions,
  createSip10CryptoAssetInfo,
  isFtAsset,
} from '@leather.io/query';
import { getPrincipalFromAssetString, getStacksAssetStringParts } from '@leather.io/stacks';
import { createBaseCryptoAssetBalance, createMoney } from '@leather.io/utils';

import { getTicker } from '@app/common/utils';
import { useCurrentNetworkState } from '@app/query/leather-query-provider';

import { useStacksClient } from '../../stacks-client';

export function useStacksFungibleTokensBalance(
  ftBalances: AddressBalanceResponse['fungible_tokens']
) {
  const client = useStacksClient();
  const network = useCurrentNetworkState();

  return useQueries({
    queries: Object.entries(ftBalances).map(([key, value]) => {
      const address = getPrincipalFromAssetString(key);
      return {
        ...createGetFungibleTokenMetadataQueryOptions({
          address,
          client,
          network: network.chain.stacks.url,
        }),
        select: (resp: FtAssetResponse | null) => {
          if (!(resp && isFtAsset(resp))) return;
          const { contractAssetName } = getStacksAssetStringParts(key);
          const name = resp.name || contractAssetName;
          const symbol = resp.symbol || getTicker(name);
          return {
            contractId: key,
            balance: createBaseCryptoAssetBalance(
              createMoney(new BigNumber(value.balance), symbol, resp.decimals ?? 0)
            ),
          };
        },
      };
    }),
  });
}

export function useStacksFungibleTokensMetadata(keys: string[]) {
  const client = useStacksClient();
  const network = useCurrentNetworkState();

  return useQueries({
    queries: keys.map(key => {
      const address = getPrincipalFromAssetString(key);
      return {
        ...createGetFungibleTokenMetadataQueryOptions({
          address,
          client,
          network: network.chain.stacks.url,
        }),
        select: (resp: FtAssetResponse | null) => {
          if (!(resp && isFtAsset(resp))) return;
          return createSip10CryptoAssetInfo(key, resp);
        },
      };
    }),
  });
}
