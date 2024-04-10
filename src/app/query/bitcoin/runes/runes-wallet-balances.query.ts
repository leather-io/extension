import { useQuery } from '@tanstack/react-query';

import { useBitcoinClient } from '@app/store/common/api-clients.hooks';

// ts-unused-exports:disable-next-line
export function useGetRunesWalletBalancesQuery(address: string) {
  const client = useBitcoinClient();

  return useQuery({
    enabled: !!address,
    queryKey: ['runes-wallet-balances', address],
    queryFn: () => client.BestinslotApi.getRunesWalletBalances(address),
  });
}
