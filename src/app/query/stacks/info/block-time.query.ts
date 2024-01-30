import { useQuery } from '@tanstack/react-query';

import { useStacksClient } from '@app/store/common/api-clients.hooks';

export function useGetStackNetworkBlockTimeQuery() {
  const client = useStacksClient();

  return useQuery({
    queryKey: ['stacks-block-time'],
    queryFn: () => client.infoApi.getNetworkBlockTimes(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
