import { type QueryFunctionContext, useQuery } from '@tanstack/react-query';

import { type AccountRequest, getBtcBalancesService } from '@leather.io/services';

import { balanceQueryOptionsWithRefetch } from '@app/query/common/balance-query-options';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

export function useGetBtcAccountBalanceQuery(request: AccountRequest) {
  const network = useCurrentNetworkState();
  return useQuery({
    queryKey: [
      'btc-balance-service-get-btc-account-balance',
      network.id,
      request.account.id.fingerprint,
      request.account.id.accountIndex,
      request.exclusions,
      request.protections,
    ],
    queryFn: ({ signal }: QueryFunctionContext) =>
      getBtcBalancesService().getBtcAccountBalance(request, signal),
    ...balanceQueryOptionsWithRefetch,
  });
}
