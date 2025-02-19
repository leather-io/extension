import { stxSignMessage } from '@leather.io/rpc';

import { formatValidationErrors, getRpcParamErrors, validateRpcParams } from './validation.utils';

export function validateRpcSignStacksMessageParams(obj: unknown) {
  return validateRpcParams(obj, stxSignMessage.params);
}

export function getRpcSignStacksMessageParamErrors(obj: unknown) {
  return formatValidationErrors(getRpcParamErrors(obj, stxSignMessage.params));
}
