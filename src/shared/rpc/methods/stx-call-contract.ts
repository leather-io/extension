import { stxCallContract } from '@leather.io/rpc';

import { formatValidationErrors, getRpcParamErrors, validateRpcParams } from './validation.utils';

export function validateRpcStxCallContractParams(obj: unknown) {
  return validateRpcParams(obj, stxCallContract.params);
}

export function getRpcStxCallContractParamErrors(obj: unknown) {
  return formatValidationErrors(getRpcParamErrors(obj, stxCallContract.params));
}
