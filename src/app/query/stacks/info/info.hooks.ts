import { useGetStackNetworkBlockTimeQuery } from './block-time.query';

export function useStacksBlockTime() {
  return useGetStackNetworkBlockTimeQuery();
}
