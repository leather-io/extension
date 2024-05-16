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
import { createCryptoAssetBalance } from '@app/query/common/models';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { getAssetStringParts } from '@app/ui/utils/get-asset-string-parts';

import { useStacksAccountBalanceFungibleTokens } from '../balance/account-balance.hooks';
import { useStacksAccountFungibleTokenMetadata } from '../token-metadata/fungible-tokens/fungible-token-metadata.hooks';
import { isFtAsset } from '../token-metadata/token-metadata.utils';
import { type Sip10CryptoAssetFilter, filterSip10Tokens } from './sip10-tokens.utils';

export function isTransferableSip10Token(asset: Partial<FtMetadataResponse>) {
  return !isUndefined(asset.decimals) && !isUndefined(asset.name) && !isUndefined(asset.symbol);
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

function useSip10Tokens(address: string) {
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
          const symbol = token.symbol ?? getTicker(token.name ?? '');

          return {
            assetInfo: createSip10CryptoAssetInfo(contractId, key, token),
            balance: createCryptoAssetBalance(
              createMoney(new BigNumber(value.balance), symbol, token.decimals ?? 0)
            ),
            marketData: priceAsMarketData(contractId, symbol),
          };
        })
        .filter(isDefined)
        .filter(asset => asset.balance.availableBalance.amount.isGreaterThan(0)),
    [priceAsMarketData, tokenMetadata, tokens]
  );
}

export function useSip10Token(contractId: string) {
  const address = useCurrentStacksAccountAddress();
  const tokens = useSip10Tokens(address);
  return useMemo(
    () => tokens.find(token => token.assetInfo.contractId === contractId),
    [contractId, tokens]
  );
}

interface UseFilteredSip10TokensArgs {
  address: string;
  filter?: Sip10CryptoAssetFilter;
}
export function useFilteredSip10Tokens({ address, filter = 'all' }: UseFilteredSip10TokensArgs) {
  const tokens = useSip10Tokens(address);
  const { data: swapAssets = [] } = useAlexSwappableAssets();

  return useMemo(() => filterSip10Tokens(swapAssets, tokens, filter), [swapAssets, tokens, filter]);
}

export function useTransferableSip10Tokens(address: string) {
  const tokens = useSip10Tokens(address);
  return useMemo(() => tokens.filter(token => token.assetInfo.canTransfer), [tokens]);
}
