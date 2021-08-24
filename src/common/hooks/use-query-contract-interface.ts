import { useCallback, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useAtom } from 'jotai';

import { apiClientState } from '@store/common/api-clients';
import { ContractInterface } from '@stacks/rpc-client';
import { ContractDictionary, contractsAtom } from '@store/contracts';
import { useAtomValue } from 'jotai/utils';

function useFetchContractInterface(contractAddress: string, contractName: string) {
  const api = useAtomValue(apiClientState);
  const [state, setState] = useAtom(contractsAtom);

  useEffect(() => {
    console.log('usefetch', state);
  }, [state]);

  const contractInterfaceFetcher = useCallback(
    () =>
      api.smartContractsApi.getContractInterface({
        contractAddress,
        contractName,
      }),
    [api.smartContractsApi, contractAddress, contractName]
  );

  const { data: contractInterface } = useQuery(
    ['contactId', contractAddress, contractName],
    contractInterfaceFetcher,
    {
      staleTime: Number.MAX_SAFE_INTEGER,
      onSuccess(x) {
        setState({ ...state, [`${contractAddress}.${contractName}`]: x } as ContractDictionary);
      },
    }
  );
  return contractInterface as ContractInterface | undefined;
}

export function useQueryContractInterface(contractId: string) {
  const [address, name] = contractId.split('.');
  return useFetchContractInterface(address, name);
}
