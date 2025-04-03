import { useQuery } from '@tanstack/react-query';

import { createGetNetworkStatusQueryOptions } from '@leather.io/query';

import { useStacksClient } from '../stacks-client';

export function useGetStacksNetworkStatusQuery(url: string) {
  const client = useStacksClient();
  return useQuery(createGetNetworkStatusQueryOptions({ client, url }));
}
