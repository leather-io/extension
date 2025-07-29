import { HttpCacheOptions, HttpCacheService } from '@leather.io/services';

import { logger } from '@shared/logger';

import { queryClient } from '@app/common/persistence';

export class ExtensionHttpCacheService extends HttpCacheService {
  async fetchWithCacheInternal<T>(
    key: unknown[],
    fetchFn: () => Promise<T>,
    options: HttpCacheOptions = {}
  ): Promise<T> {
    logger.info(key.join('|'), JSON.stringify(options));
    return queryClient.fetchQuery({
      queryKey: key,
      queryFn: fetchFn,
      staleTime: options.ttl ?? 0,
      retry: false,
    });
  }
}
