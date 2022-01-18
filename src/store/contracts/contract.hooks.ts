import { useAtom } from 'jotai';

import { contractInterfaceState } from '@store/contracts/contract';

export function useContractInterfaceState() {
  return useAtom(contractInterfaceState);
}
