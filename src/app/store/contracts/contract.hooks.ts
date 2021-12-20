import { useAtom } from 'jotai';

import { contractInterfaceState } from '@app/store/contracts/contract';

export function useContractInterfaceState() {
  return useAtom(contractInterfaceState);
}
