import type { Sip10Balance } from '@leather.io/services';
import { isSameAsset } from '@leather.io/utils';

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

export function useManagedSip10Tools(accountIndex: number) {
  const enabledSip10s = useSip10AccountBalance(accountIndex);

  return {
    isEnabled: (token: Sip10Balance) =>
      !!enabledSip10s.value?.sip10s.find(sip10 => isSameAsset(sip10.asset, token.asset)),
  };
}

export function useSip10TokenBalance(accountIndex: number, contractId: string) {
  const balance = useSip10AccountBalance(accountIndex);
  return balance.value?.sip10s.find(t => t.asset.contractId === contractId);
}

function useSip10AddressBalance(address: string) {
  return toFetchState(useGetSip10AddressBalanceQuery(address));
}

export function useSip10AccountBalance(
  accountIndex: number,
  options?: { includeHiddenAssets?: boolean }
) {
  const account = useAccountAddresses(accountIndex);
  return toFetchState(
    useGetSip10AccountBalanceQuery({
      account,
      assets: { includeHiddenAssets: options?.includeHiddenAssets },
    })
  );
}
