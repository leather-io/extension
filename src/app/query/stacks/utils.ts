import { Configuration, Middleware, RequestContext } from '@stacks/blockchain-api-client';

import { MICROBLOCKS_ENABLED } from '@shared/constants';

import { fetcher as fetchApi } from '@app/common/api/wrapped-fetch';

const unanchoredStacksMiddleware: Middleware = {
  pre: (context: RequestContext) => {
    const url = new URL(context.url);
    if (!url.toString().includes('/v2')) url.searchParams.set('unanchored', 'true');
    return Promise.resolve({
      init: context.init,
      url: url.toString(),
    });
  },
};

export function createStacksUnanchoredConfig(basePath: string) {
  const middleware: Middleware[] = [];
  if (MICROBLOCKS_ENABLED) middleware.push(unanchoredStacksMiddleware);
  return new Configuration({
    basePath,
    fetchApi,
    middleware,
  });
}

export function createStacksAnchoredConfig(basePath: string) {
  return new Configuration({
    basePath,
    fetchApi,
  });
}
