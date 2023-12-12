import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { Money } from '@shared/models/money.model';

import { useBitcoinContracts } from '@app/common/hooks/use-bitcoin-contracts';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

const staleTime = 1 * 60 * 1000;

const balanceQueryOptions = {
  staleTime,
  keepPreviousData: false,
  refetchOnMount: true,
} as const;

export function useBitcoinContractsBalanceQuery(): UseQueryResult<Money> {
  const { sumBitcoinContractCollateralAmounts } = useBitcoinContracts();
  const currentNetwork = useCurrentNetwork();

  return useQuery({
    queryKey: ['sum-bitcoin-contract-collateral-amounts', currentNetwork.id],
    queryFn: sumBitcoinContractCollateralAmounts,
    enabled: !!currentNetwork,
    ...balanceQueryOptions,
  });
}
