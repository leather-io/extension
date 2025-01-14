import { stxSignTransactionRequestParamsSchema } from '@leather.io/rpc';

import { formatValidationErrors, getRpcParamErrors, validateRpcParams } from './validation.utils';

export function validateRpcSignStacksTransactionParams(obj: unknown) {
  return validateRpcParams(obj, stxSignTransactionRequestParamsSchema);
}

export function getRpcSignStacksTransactionParamErrors(obj: unknown) {
  return formatValidationErrors(getRpcParamErrors(obj, stxSignTransactionRequestParamsSchema));
}
