import { useQuery } from '@tanstack/react-query';

import { useBitcoinClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

// ts-unused-exports:disable-next-line
export function useGetRunesWalletBalancesQuery(address: string) {
  const client = useBitcoinClient();
  const network = useCurrentNetwork();

  return useQuery({
    enabled: !!(address && network.chain.bitcoin.bitcoinNetwork === 'testnet'),
    queryKey: ['runes-wallet-balances', address],
    queryFn: () => client.BestinslotApi.getRunesWalletBalances(address),
  });
}
