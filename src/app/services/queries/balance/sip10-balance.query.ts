import { type QueryFunctionContext, useQuery } from '@tanstack/react-query';

import { getSip10BalancesService } from '@leather.io/services';

import { toFetchState } from '@app/services/fetch-state';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { balanceQueryOptions } from './balance-query-options';

export function useCurrentAccountSip10Balance() {
  const stxAddress = useCurrentStacksAccountAddress();
  return toFetchState(useGetSip10AddressBalanceQuery(stxAddress));
}

function useGetSip10AddressBalanceQuery(address: string) {
  return useQuery({
    queryKey: ['sip10-balances-service-get-sip10-address-balance', address],
    queryFn: ({ signal }: QueryFunctionContext) =>
      getSip10BalancesService().getSip10AddressBalance(address, signal),
    ...balanceQueryOptions,
  });
}
