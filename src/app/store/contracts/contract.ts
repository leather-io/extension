import { atom } from 'jotai';

import { ContractInterfaceResponseWithFunctions } from '@shared/models/contract-types';

export const contractInterfaceState = atom<ContractInterfaceResponseWithFunctions | undefined>(
  undefined
);

contractInterfaceState.debugLabel = 'contractInterfaceState';
