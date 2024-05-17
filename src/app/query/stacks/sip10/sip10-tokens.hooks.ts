import { useMemo } from 'react';

import type { FtMetadataResponse } from '@hirosystems/token-metadata-api-client';
import type { Sip10CryptoAssetInfo } from '@leather-wallet/models';
import BigNumber from 'bignumber.js';

import { createMoney } from '@shared/models/money.model';
import { isDefined, isUndefined } from '@shared/utils';

import { getTicker, pullContractIdFromIdentity } from '@app/common/utils';
import {
  useAlexCurrencyPriceAsMarketData,
  useAlexSwappableAssets,
} from '@app/query/common/alex-sdk/alex-sdk.hooks';
import {
  type AccountCryptoAssetWithDetails,
  type Sip10AccountCryptoAssetWithDetails,
  createAccountCryptoAssetWithDetailsFactory,
} from '@app/query/models/crypto-asset.model';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { getAssetStringParts } from '@app/ui/utils/get-asset-string-parts';

import { useStacksAccountBalanceFungibleTokens } from '../balance/account-balance.hooks';
import { useStacksAccountFungibleTokenMetadata } from '../token-metadata/fungible-tokens/fungible-token-metadata.hooks';
import { isFtAsset } from '../token-metadata/token-metadata.utils';
import {
  type Sip10CryptoAssetFilter,
  filterSip10AccountCryptoAssetsWithDetails,
} from './sip10-tokens.utils';

export function isTransferableSip10Token(asset: Partial<FtMetadataResponse>) {
  return !isUndefined(asset.decimals) && !isUndefined(asset.name) && !isUndefined(asset.symbol);
}

export function getSip10InfoFromAsset(asset: AccountCryptoAssetWithDetails) {
  if ('contractId' in asset.info) return asset.info;
  return;
}

function createSip10CryptoAssetInfo(
  contractId: string,
  key: string,
  token: FtMetadataResponse
): Sip10CryptoAssetInfo {
  const { assetName, contractName } = getAssetStringParts(key);
  const name = token.name ? token.name : assetName;

  return {
    canTransfer: isTransferableSip10Token(token),
    contractId,
    contractName,
    decimals: token.decimals ?? 0,
    hasMemo: isTransferableSip10Token(token),
    imageCanonicalUri: token.image_canonical_uri ?? '',
    name,
    symbol: token.symbol ?? getTicker(name),
  };
}

function useSip10AccountCryptoAssetsWithDetails(address: string) {
  const { data: tokens = {} } = useStacksAccountBalanceFungibleTokens(address);
  const tokenMetadata = useStacksAccountFungibleTokenMetadata(tokens);
  const priceAsMarketData = useAlexCurrencyPriceAsMarketData();

  return useMemo(
    () =>
      Object.entries(tokens)
        .map(([key, value], i) => {
          const token = tokenMetadata[i].data;
          if (!(token && isFtAsset(token))) return;
          const contractId = pullContractIdFromIdentity(key);

          return createAccountCryptoAssetWithDetailsFactory<Sip10AccountCryptoAssetWithDetails>({
            balance: {
              availableBalance: createMoney(
                new BigNumber(value.balance),
                token.symbol ?? getTicker(token.name ?? ''),
                token.decimals ?? 0
              ),
            },
            chain: 'stacks',
            info: createSip10CryptoAssetInfo(contractId, key, token),
            marketData: priceAsMarketData(contractId, token.symbol),
            type: 'sip-10',
          });
        })
        .filter(isDefined)
        .filter(asset => asset.balance.availableBalance.amount.isGreaterThan(0)),
    [priceAsMarketData, tokenMetadata, tokens]
  );
}

export function useSip10CryptoAssetWithDetails(contractId: string) {
  const address = useCurrentStacksAccountAddress();
  const assets = useSip10AccountCryptoAssetsWithDetails(address);
  return useMemo(
    () => assets.find(asset => asset.info.contractId === contractId),
    [assets, contractId]
  );
}

interface UseFilteredSip10AccountCryptoAssetsWithDetailsArgs {
  address: string;
  filter?: Sip10CryptoAssetFilter;
}
export function useFilteredSip10AccountCryptoAssetsWithDetails({
  address,
  filter = 'all',
}: UseFilteredSip10AccountCryptoAssetsWithDetailsArgs) {
  const assets = useSip10AccountCryptoAssetsWithDetails(address);
  const { data: swapAssets = [] } = useAlexSwappableAssets();

  return useMemo(
    () => filterSip10AccountCryptoAssetsWithDetails(assets, swapAssets, filter),
    [assets, swapAssets, filter]
  );
}

export function useTransferableSip10CryptoAssetsWithDetails(
  address: string
): Sip10AccountCryptoAssetWithDetails[] {
  const assets = useSip10AccountCryptoAssetsWithDetails(address);
  return useMemo(() => assets.filter(asset => asset.info.canTransfer), [assets]);
}
