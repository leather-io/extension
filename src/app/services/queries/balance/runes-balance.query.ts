import { type QueryFunctionContext, useQuery } from '@tanstack/react-query';

import type { AccountAddresses } from '@leather.io/models';
import { getRunesBalancesService } from '@leather.io/services';

import { toFetchState } from '@app/services/fetch-state';
import { useAccountAddresses } from '@app/services/use-account-addresses';

import { balanceQueryOptions } from './balance-query-options';

export function useCurrentAccountRunesBalance() {
  const account = useAccountAddresses();
  return toFetchState(useGetRunesAccountBalanceQuery(account));
}

function useGetRunesAccountBalanceQuery(account: AccountAddresses) {
  return useQuery({
    queryKey: [
      'runes-balances-service-get-runes-account-balance',
      account.id.fingerprint,
      account.id.accountIndex,
    ],
    queryFn: ({ signal }: QueryFunctionContext) =>
      getRunesBalancesService().getRunesAccountBalance(account, signal),
    ...balanceQueryOptions,
  });
}
