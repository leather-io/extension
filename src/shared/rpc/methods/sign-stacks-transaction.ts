import { stxSignTransaction } from '@leather.io/rpc';

import { formatValidationErrors, getRpcParamErrors, validateRpcParams } from './validation.utils';

export function validateRpcSignStacksTransactionParams(obj: unknown) {
  return validateRpcParams(obj, stxSignTransaction.params);
}

export function getRpcSignStacksTransactionParamErrors(obj: unknown) {
  return formatValidationErrors(getRpcParamErrors(obj, stxSignTransaction.params));
}
