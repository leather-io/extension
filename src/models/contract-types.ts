import { ContractInterfaceFunction } from '@stacks/rpc-client';
import { ContractInterfaceResponse } from '@stacks/stacks-blockchain-api-types';

export type ContractInterfaceResponseWithFunctions = Omit<
  ContractInterfaceResponse,
  'functions'
> & {
  functions: ContractInterfaceFunction[];
};
