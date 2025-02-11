import { stxCallContract } from '@leather.io/rpc';

import { formatValidationErrors, getRpcParamErrors, validateRpcParams } from './validation.utils';

export function validateRpcStxDeployContractParams(obj: unknown) {
  return validateRpcParams(obj, stxCallContract.params);
}

export function getRpcStxDeployContractParamErrors(obj: unknown) {
  return formatValidationErrors(getRpcParamErrors(obj, stxCallContract.params));
}
