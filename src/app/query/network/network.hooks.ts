import { useGetNetworkStatus } from './network.query';

export function useNetworkStatus(url: string): boolean {
  const result = useGetNetworkStatus(url);
  return result.isSuccess;
}
