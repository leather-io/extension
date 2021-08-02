import { atom } from 'jotai';
import { currentNetworkState } from '@store/networks';
import {
  Configuration,
  AccountsApi,
  SmartContractsApi,
  InfoApi,
  BlocksApi,
  FeesApi,
} from '@stacks/blockchain-api-client';
import { fetcher } from '@common/api/wrapped-fetch';
import { MICROBLOCKS_ENABLED } from '@common/constants';
import type { Middleware, RequestContext } from '@stacks/blockchain-api-client';
import { atomFamily } from 'jotai/utils';

// Used to display microblock, this passes unanchored=true to the search param
const unanchoredMiddleware: Middleware = {
  pre: (context: RequestContext) => {
    const url = new URL(context.url);
    if (!url.toString().includes('/v2')) url.searchParams.set('unanchored', 'true');
    return Promise.resolve({
      init: context.init,
      url: url.toString(),
    });
  },
};

export const apiClientConfiguration = atomFamily<string, Configuration>(basePath =>
  atom<Configuration>(_get => {
    const middleware: Middleware[] = [];
    if (MICROBLOCKS_ENABLED) middleware.push(unanchoredMiddleware);
    return new Configuration({
      basePath,
      fetchApi: fetcher,
      middleware,
    });
  })
);

export const smartContractClientState = atom<SmartContractsApi>(get => {
  const network = get(currentNetworkState);
  const config = get(apiClientConfiguration(network.url));
  return new SmartContractsApi(config);
});

export const accountsApiClientState = atom<AccountsApi>(get => {
  const network = get(currentNetworkState);
  const config = get(apiClientConfiguration(network.url));
  return new AccountsApi(config);
});

export const infoApiClientState = atom<InfoApi>(get => {
  const network = get(currentNetworkState);
  const config = get(apiClientConfiguration(network.url));
  return new InfoApi(config);
});

export const blocksApiClientState = atom<BlocksApi>(get => {
  const network = get(currentNetworkState);
  const config = get(apiClientConfiguration(network.url));
  return new BlocksApi(config);
});

export const feesApiClientState = atom<FeesApi>(get => {
  const network = get(currentNetworkState);
  const config = get(apiClientConfiguration(network.url));
  return new FeesApi(config);
});
