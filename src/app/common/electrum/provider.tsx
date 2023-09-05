import { ReactNode, createContext, useContext, useEffect, useMemo } from 'react';

import ElectrumClient from 'electrum-client-sl';

import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { initElectrumClient } from './client';

export interface ElectrumClientContext {
  electrumClient?: ElectrumClient;
}

export const ElectrumClientContext = createContext<ElectrumClientContext>({});

export function useElectrumClient() {
  const { electrumClient } = useContext(ElectrumClientContext);

  if (!electrumClient) {
    throw new Error('No ElectrumClient instance has been provided or context has been defined.');
  }

  return electrumClient;

  // const network = useCurrentNetworkState();
  // const client = useMemo(() => initElectrumClient(network.id), [network]);

  // const withElectrumClient = async <T>(
  //   callback: (client: ElectrumClient) => Promise<T>
  // ): Promise<T> => {
  //   await client.connect();

  //   let response: T;

  //   try {
  //     response = await callback(client);
  //     await client.close();
  //   } catch (error) {
  //     await client.close();
  //     throw error;
  //   }

  //   return response;
  // };

  // return { withElectrumClient };
}

export interface ElectrumClientProviderProps {
  children: ReactNode;
}

export function ElectrumClientProvider({ children }: ElectrumClientProviderProps) {
  const network = useCurrentNetworkState();
  const electrumClient = useMemo(() => initElectrumClient(network.id), [network]);

  useEffect(() => {
    async function connectElectrumClient() {
      await electrumClient.connect();
    }

    void connectElectrumClient();

    return () => {
      void electrumClient.close();
    };
  }, [electrumClient]);

  return (
    <ElectrumClientContext.Provider value={{ electrumClient }}>
      {children}
    </ElectrumClientContext.Provider>
  );
}
