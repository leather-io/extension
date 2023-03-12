import { useQuery } from '@tanstack/react-query';

import { useStacksClientUnanchored } from '@app/store/common/api-clients.hooks';

export function useGetStackNetworkBlockTimeQuery() {
  const client = useStacksClientUnanchored();

  return useQuery({
    queryKey: ['stacks-block-time'],
    queryFn: () => client.infoApi.getNetworkBlockTimes(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
