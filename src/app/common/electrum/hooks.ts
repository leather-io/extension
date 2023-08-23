import { useMemo } from 'react';

import ElectrumClient from 'electrum-client-sl';

import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { initElectrumClient } from './client';

export function useElectrumClient() {
  const network = useCurrentNetworkState();
  const client = useMemo(() => initElectrumClient(network.id), [network]);

  const withElectrumClient = async <T>(
    callback: (client: ElectrumClient) => Promise<T>
  ): Promise<T> => {
    await client.connect();

    let response: T;

    try {
      response = await callback(client);
      await client.close();
    } catch (error) {
      await client.close();
      throw error;
    }

    return response;
  };

  return { withElectrumClient };
}
