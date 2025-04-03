import { useQuery } from '@tanstack/react-query';

import { createGetBnsNamesOwnedByAddressQueryOptions } from '@leather.io/query';

import { useCurrentNetworkState } from '@app/query/leather-query-provider';

import { useBnsV2Client } from './bns-v2-client';

export function useGetBnsNamesOwnedByAddressQuery(address: string) {
  const { mode } = useCurrentNetworkState();
  const client = useBnsV2Client();

  return useQuery(createGetBnsNamesOwnedByAddressQueryOptions({ address, network: mode, client }));
}
