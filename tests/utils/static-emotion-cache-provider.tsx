import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

const cache = createCache({ key: 'static' });

export default function StaticEmotionCacheProvider({ children }: any) {
  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
