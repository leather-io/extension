import { type QueryFunctionContext, useQuery } from '@tanstack/react-query';

import { getStxBalancesService } from '@leather.io/services';

import { toFetchState } from '@app/services/fetch-state';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { balanceQueryOptions } from './balance-query-options';

export function useCurrentAccountStxBalance() {
  const stxAddress = useCurrentStacksAccountAddress();
  return toFetchState(useGetStxAddressBalanceQuery(stxAddress));
}

function useGetStxAddressBalanceQuery(address: string) {
  return useQuery({
    queryKey: ['stx-balances-service-get-stx-address-balance', address],
    queryFn: ({ signal }: QueryFunctionContext) =>
      getStxBalancesService().getStxAddressBalance(address, signal),
    ...balanceQueryOptions,
  });
}
