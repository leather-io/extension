import { useGetNetworkStatus } from './network.query';

export function useNetworkStatus(url: string) {
  const result = useGetNetworkStatus(url);
  return result.isSuccess;
}
