import { atom } from 'jotai';

import { ContractInterfaceResponseWithFunctions } from '@models/contract-types';

export const contractInterfaceState = atom<ContractInterfaceResponseWithFunctions | undefined>(
  undefined
);

contractInterfaceState.debugLabel = 'contractInterfaceState';
