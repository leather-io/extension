import { type QueryFunctionContext, useQuery } from '@tanstack/react-query';

import { BtcAccountRequest, getBtcBalancesService } from '@leather.io/services';

import { toFetchState } from '@app/services/fetch-state';
import { useAccountAddresses } from '@app/services/use-account-addresses';
import { useDiscardedInscriptions } from '@app/store/settings/settings.selectors';

import { balanceQueryOptions } from './balance-query-options';

// ts-unused-exports:disable-next-line
export function useCurrentAccountNativeSegwitBtcBalance() {
  const account = useAccountAddresses();
  const { discardedInscriptions } = useDiscardedInscriptions();
  return toFetchState(
    useGetBtcAccountBalanceQuery({
      account,
      protections: { discardedInscriptions },
    })
  );
}

export function useCurrentAccountBtcBalance() {
  const account = useAccountAddresses();
  const { discardedInscriptions } = useDiscardedInscriptions();
  return toFetchState(
    useGetBtcAccountBalanceQuery({
      account,
      protections: { discardedInscriptions },
    })
  );
}

function useGetBtcAccountBalanceQuery(request: BtcAccountRequest) {
  return useQuery({
    queryKey: [
      'btc-balance-service-get-btc-account-balance',
      request.account.id.fingerprint,
      request.account.id.accountIndex,
      JSON.stringify(request.protections),
    ],
    queryFn: ({ signal }: QueryFunctionContext) =>
      getBtcBalancesService().getBtcAccountBalance(request, signal),
    ...balanceQueryOptions,
  });
}
