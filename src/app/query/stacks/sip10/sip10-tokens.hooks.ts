import { useMemo } from 'react';

import type {
  BaseCryptoAssetBalance,
  CryptoAssetBalance,
  Sip10CryptoAssetInfo,
} from '@leather.io/models';
import { type Sip10CryptoAssetFilter } from '@leather.io/query';
import { getPrincipalFromAssetString } from '@leather.io/stacks';
import { isDefined, isUndefined } from '@leather.io/utils';

import { type SwapAsset, useAlexSwappableAssets } from '@app/query/common/alex-sdk/alex-sdk.hooks';

import { useStacksAccountBalanceFungibleTokens } from '../balance/account-balance.hooks';
import {
  useStacksFungibleTokensBalance,
  useStacksFungibleTokensMetadata,
} from '../token-metadata/fungible-tokens/fungible-token-metadata.hooks';

export function filterSip10Tokens(
  swapAssets: SwapAsset[],
  tokens: {
    balance: CryptoAssetBalance;
    info: Sip10CryptoAssetInfo;
  }[],
  filter: Sip10CryptoAssetFilter
) {
  return tokens.filter(token => {
    const principal = getPrincipalFromAssetString(token.info.contractId);
    if (filter === 'supported') {
      return swapAssets.some(swapAsset => swapAsset.principal === principal);
    }
    if (filter === 'unsupported') {
      return !swapAssets.some(swapAsset => swapAsset.principal === principal);
    }
    return true;
  });
}

function useSip10TokensCryptoAssetBalance(address: string) {
  const { data: tokens = {} } = useStacksAccountBalanceFungibleTokens(address);
  return useStacksFungibleTokensBalance(tokens);
}

function useSip10TokensCryptoAssetInfo(address: string) {
  const { data: tokens = {} } = useStacksAccountBalanceFungibleTokens(address);
  return useStacksFungibleTokensMetadata(Object.keys(tokens));
}

export interface Sip10TokenAssetDetails {
  balance: BaseCryptoAssetBalance;
  info: Sip10CryptoAssetInfo;
}

function useSip10Tokens(address: string): {
  isLoading: boolean;
  tokens: Sip10TokenAssetDetails[];
} {
  const balancesResults = useSip10TokensCryptoAssetBalance(address);
  const infoResults = useSip10TokensCryptoAssetInfo(address);

  return useMemo(() => {
    const isLoading =
      balancesResults.some(query => query.isLoading) || infoResults.some(query => query.isLoading);
    const tokenBalances = balancesResults
      .map(query => query.data)
      .filter(isDefined)
      .filter(token => token.balance.availableBalance.amount.isGreaterThan(0));
    const tokenInfo = infoResults.map(query => query.data).filter(isDefined);
    const tokens = tokenInfo.map(info => {
      const tokenBalance = tokenBalances.find(
        balance => balance.contractId === info.contractId
      )?.balance;
      if (isUndefined(tokenBalance)) return;
      return {
        balance: tokenBalance,
        info,
      };
    });

    return {
      isLoading,
      tokens: tokens.filter(isDefined),
    };
  }, [balancesResults, infoResults]);
}

export function useSip10Token(address: string, contractId: string) {
  const { tokens = [] } = useSip10Tokens(address);
  return useMemo(
    () => tokens.find(token => token.info.contractId === contractId),
    [contractId, tokens]
  );
}

interface UseSip10TokensArgs {
  address: string;
  filter?: Sip10CryptoAssetFilter;
}
export function useFilteredSip10Tokens({ address, filter = 'all' }: UseSip10TokensArgs) {
  const { isLoading, tokens = [] } = useSip10Tokens(address);
  const { data: swapAssets = [] } = useAlexSwappableAssets(address);
  const filteredTokens = useMemo(
    () => filterSip10Tokens(swapAssets, tokens, filter),
    [swapAssets, tokens, filter]
  );
  return { isLoading, tokens: filteredTokens };
}

export function useTransferableSip10Tokens(address: string) {
  const { tokens = [] } = useSip10Tokens(address);
  return useMemo(() => tokens.filter(token => token.info.canTransfer), [tokens]);
}
