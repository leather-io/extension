import type { Sip10Balance } from '@leather.io/services';
import {
  aggregateBaseCryptoAssetBalances,
  createBaseCryptoAssetBalance,
  createMoney,
} from '@leather.io/utils';

import { type AssetFilter, useManageTokens } from '@app/common/hooks/use-manage-tokens';
import { toFetchState } from '@app/services/fetch-state';
import { useAccountAddresses } from '@app/services/use-account-addresses';

import {
  useGetSip10AccountBalanceQuery,
  useGetSip10AddressBalanceQuery,
} from './sip10-balance.query';

export function useSip10AddressTransferableTokenBalances(address: string) {
  const balance = useSip10AddressBalance(address);
  if (balance.state !== 'success') {
    return {
      isLoading: true,
      sip10s: [],
    };
  }
  return {
    isLoading: false,
    sip10s: balance.value.sip10s.filter(
      t => t.crypto.availableBalance.amount.isGreaterThan(0) && t.asset.canTransfer
    ),
  };
}

export function useManagedSip10AccountBalance(accountIndex: number, assetFilter: AssetFilter) {
  const balance = useSip10AccountBalance(accountIndex);
  const { filterTokens, isTokenEnabled } = useManageTokens();

  if (balance.state !== 'success') {
    return {
      isLoading: true,
    };
  }

  const preEnabledTokensIds = balance.value.sip10s
    .filter(t => t.quote.availableBalance.amount.isGreaterThan(0))
    .map(t => t.asset.assetId);

  const managedTokens = filterTokens({
    tokens: balance.value.sip10s,
    filter: assetFilter,
    getTokenId: t => t.asset.assetId,
    preEnabledTokensIds,
  });

  return {
    isLoading: false,
    sip10s: managedTokens,
    balance:
      managedTokens.length > 0
        ? aggregateBaseCryptoAssetBalances(managedTokens.map(t => t.quote))
        : createBaseCryptoAssetBalance(createMoney(0, 'USD')),
    isEnabled: (token: Sip10Balance) =>
      isTokenEnabled({ tokenId: token.asset.assetId, preEnabledTokensIds }),
  };
}

export function useSip10TokenBalance(accountIndex: number, contractId: string) {
  const balance = useSip10AccountBalance(accountIndex);
  return balance.value?.sip10s.find(t => t.asset.contractId === contractId);
}

function useSip10AddressBalance(address: string) {
  return toFetchState(useGetSip10AddressBalanceQuery(address));
}

function useSip10AccountBalance(accountIndex: number) {
  const account = useAccountAddresses(accountIndex);
  return toFetchState(useGetSip10AccountBalanceQuery({ account }));
}
