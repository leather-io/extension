import { ensureArray, isUndefined } from '@shared/utils';

import { useStampsByAddressQuery } from './stamps-by-address.query';

export function useStampsByAddress(address: string) {
  return useStampsByAddressQuery(address, {
    select(resp) {
      if (isUndefined(resp.data)) return [];
      return ensureArray(resp.data.stamps);
    },
  });
}

export function useSrc20TokensByAddress(address: string) {
  return useStampsByAddressQuery(address, {
    select(resp) {
      if (isUndefined(resp.data)) return [];
      return ensureArray(resp.data.src20);
    },
  });
}
