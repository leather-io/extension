import ElectrumClient from 'electrum-client-sl';

import type { DefaultNetworkConfigurations } from '@shared/constants';

function getElectrumConfig(network: DefaultNetworkConfigurations) {
  switch (network) {
    case 'devnet':
      return {
        protocol: 'tcp',
        host: 'localhost',
        port: 50001,
      };

    case 'mainnet':
      return {
        protocol: 'ssl',
        host: 'fortress.qtornado.com',
        port: 443,
      };

    default:
      return {
        protocol: 'ssl',
        host: 'blackie.c3-soft.com',
        port: 57006,
      };
  }
}

export function initElectrumClient(network: DefaultNetworkConfigurations) {
  const config = getElectrumConfig(network);
  const client = new ElectrumClient(config.host, config.port, config.protocol);

  return client;
}
