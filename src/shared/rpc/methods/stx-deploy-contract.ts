import { stxDeployContractRequestParamsSchema } from '@leather.io/rpc';

import { formatValidationErrors, getRpcParamErrors, validateRpcParams } from './validation.utils';

export function validateRpcStxDeployContractParams(obj: unknown) {
  return validateRpcParams(obj, stxDeployContractRequestParamsSchema);
}

export function getRpcStxDeployContractParamErrors(obj: unknown) {
  return formatValidationErrors(getRpcParamErrors(obj, stxDeployContractRequestParamsSchema));
}
