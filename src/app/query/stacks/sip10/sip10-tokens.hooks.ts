import { useMemo } from 'react';

import type { BaseCryptoAssetBalance, Sip10CryptoAssetInfo } from '@leather-wallet/models';

import { isDefined, isUndefined } from '@shared/utils';

import { useAlexSwappableAssets } from '@app/query/common/alex-sdk/alex-sdk.hooks';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { useStacksAccountBalanceFungibleTokens } from '../balance/account-balance.hooks';
import {
  useGetFungibleTokensBalanceMetadataQuery,
  useGetFungibleTokensMetadataQuery,
} from '../token-metadata/fungible-tokens/fungible-token-metadata.query';
import { type Sip10CryptoAssetFilter, filterSip10Tokens } from './sip10-tokens.utils';

function useSip10TokensCryptoAssetBalance(address: string) {
  const { data: tokens = {} } = useStacksAccountBalanceFungibleTokens(address);
  return useGetFungibleTokensBalanceMetadataQuery(tokens);
}

function useSip10TokensCryptoAssetInfo(address: string) {
  const { data: tokens = {} } = useStacksAccountBalanceFungibleTokens(address);
  return useGetFungibleTokensMetadataQuery(Object.keys(tokens));
}

export interface Sip10TokenAssetDetails {
  balance: BaseCryptoAssetBalance;
  info: Sip10CryptoAssetInfo;
}

function useSip10Tokens(address: string): {
  isInitialLoading: boolean;
  tokens: Sip10TokenAssetDetails[];
} {
  const balancesResults = useSip10TokensCryptoAssetBalance(address);
  const infoResults = useSip10TokensCryptoAssetInfo(address);

  return useMemo(() => {
    // We can potentially use the 'combine' option in react-query v5 to replace this?
    // https://tanstack.com/query/latest/docs/framework/react/reference/useQueries#combine
    const isInitialLoading =
      balancesResults.some(query => query.isInitialLoading) ||
      infoResults.some(query => query.isInitialLoading);
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
      isInitialLoading,
      tokens: tokens.filter(isDefined),
    };
  }, [balancesResults, infoResults]);
}

export function useSip10Token(contractId: string) {
  const address = useCurrentStacksAccountAddress();
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
  const { isInitialLoading, tokens = [] } = useSip10Tokens(address);
  const { data: swapAssets = [] } = useAlexSwappableAssets();
  const filteredTokens = useMemo(
    () => filterSip10Tokens(swapAssets, tokens, filter),
    [swapAssets, tokens, filter]
  );
  return { isInitialLoading, tokens: filteredTokens };
}

export function useTransferableSip10Tokens(address: string) {
  const { tokens = [] } = useSip10Tokens(address);
  return useMemo(() => tokens.filter(token => token.info.canTransfer), [tokens]);
}
