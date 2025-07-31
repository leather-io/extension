import localforage from 'localforage';

import { HttpCacheOptions, HttpCacheService } from '@leather.io/services';

export const servicesCache = localforage.createInstance({
  name: 'leather-services-http-cache',
  driver: [localforage.INDEXEDDB],
});

const executionLocks = new Map<string, boolean>();
const LOCK_TIMEOUT = 5000;

export class ExtensionHttpCacheService extends HttpCacheService {
  async fetchWithCacheInternal<T>(
    key: unknown[],
    fetchFn: () => Promise<T>,
    options: HttpCacheOptions = {}
  ): Promise<T> {
    const cacheKey = JSON.stringify(key);
    const lockKey = `${cacheKey}-lock`;
    const ttl = options.ttl ?? 0;
    const now = Date.now();

    if (ttl > 0) {
      try {
        const cached = await servicesCache.getItem<{ data: T; timestamp: number }>(cacheKey);
        if (cached && now - cached.timestamp < ttl) {
          return cached.data;
        }
      } catch (e) {}
    }

    const isLocked = executionLocks.get(lockKey);
    if (isLocked) {
      const startWait = Date.now();
      while (executionLocks.get(lockKey) && Date.now() - startWait < LOCK_TIMEOUT) {
        await new Promise(resolve => setTimeout(resolve, 50)); // 50ms polling
      }
      if (ttl > 0) {
        try {
          const cached = await servicesCache.getItem<{ data: T; timestamp: number }>(cacheKey);
          if (cached && now - cached.timestamp < 2000) {
            return cached.data;
          }
        } catch (e) {}
      }
    }

    executionLocks.set(lockKey, true);
    try {
      const result = await fetchFn();
      if (ttl > 0) {
        try {
          await servicesCache.setItem(cacheKey, { data: result, timestamp: now });
        } catch (e) {}
      }
      return result;
    } finally {
      executionLocks.delete(lockKey);
    }
  }
}
