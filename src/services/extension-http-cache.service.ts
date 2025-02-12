import { QueryKey } from '@tanstack/react-query';

import { HttpCacheKey, HttpCacheOptions, HttpCacheService } from '@leather.io/services';

import { queryClient } from '@app/common/persistence';

export function createExtensionHttpCacheService(): HttpCacheService {
  return {
    async fetchWithCache<T>(
      key: HttpCacheKey,
      fetchFn: () => Promise<T>,
      options: HttpCacheOptions = {}
    ): Promise<T> {
      return queryClient.fetchQuery({
        queryKey: key as QueryKey,
        queryFn: fetchFn,
        staleTime: options.ttl ?? 0,
        gcTime: options.ttl ?? 0,
        retry: false,
      });
    },
  };
}
