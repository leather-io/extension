import { useStampsByAddressQuery } from '@leather-wallet/query';

export function useStampsByAddress(address: string) {
  return useStampsByAddressQuery(address, {
    select(data) {
      return data.data?.stamps;
    },
  });
}

export function useSrc20TokensByAddress(address: string) {
  return useStampsByAddressQuery(address, {
    select(data) {
      return data.data?.src20;
    },
  });
}
