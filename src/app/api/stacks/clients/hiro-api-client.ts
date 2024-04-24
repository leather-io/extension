import axios from 'axios';

import { type DefaultNetworkConfigurations, defaultNetworksKeyedById } from '@shared/constants';

export const leatherHeaders = {
  'x-leather-version': VERSION,
  'x-hiro-product': 'leather',
};

export function hiroApiClient(network: DefaultNetworkConfigurations) {
  return axios.create({
    baseURL: defaultNetworksKeyedById[network].chain.stacks.url,
    headers: { ...leatherHeaders },
  });
}
