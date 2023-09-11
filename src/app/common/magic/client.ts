import { projectFactory } from '@clarigen/core';
import { ClarigenClient, DEPLOYMENT_NETWORKS } from '@clarigen/core';

import { DefaultNetworkConfigurations } from '@shared/constants';

import { project } from './contracts';

const networkUrl = {
  mainnet: 'https://api.hiro.so',
  testnet: 'https://api.testnet.hiro.so',
  signet: 'http://localhost:3999',
  devnet: 'http://localhost:3999',
};

export interface MagicClientOptions {
  network: DefaultNetworkConfigurations;
}

export function initMagicClient({ network }: MagicClientOptions) {
  return new ClarigenClient(networkUrl[network]);
}

function getDeploymentNetwork(network: DefaultNetworkConfigurations) {
  if (network === 'signet') return 'simnet';

  for (const type of DEPLOYMENT_NETWORKS) {
    if (type === network) return network;
  }

  throw new Error(
    `Invalid SUPPLIER_NETWORK config. Valid values are ${DEPLOYMENT_NETWORKS.join(',')}`
  );
}

export function getMagicContracts(network: DefaultNetworkConfigurations) {
  return projectFactory(project, getDeploymentNetwork(network));
}

export type MagicContracts = ReturnType<typeof getMagicContracts>;

export type MagicBridgeContract = MagicContracts['bridge'];
