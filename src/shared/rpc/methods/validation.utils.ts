import { z } from 'zod';
import { fromError } from 'zod-validation-error';

export const RpcErrorMessage = {
  InvalidParams: 'Invalid parameters',
  NullOrigin: 'Origin is null',
  UndefinedParams: 'Undefined parameters',
  UserRejectedOperation: 'User rejected request',
  UndefinedTransaction: 'Error generating unsigned transaction',
  UnsignedTransaction: 'Error signing transaction',
  BroadcastError: 'Error broadcasting transaction',
} as const;

export const accountSchema = z.number().int();

export function validateRpcParams(obj: unknown, validator: z.ZodSchema) {
  try {
    validator.parse(obj);
    return true;
  } catch (e) {
    return false;
  }
}

export function getRpcParamErrors(obj: unknown, validator: z.ZodTypeAny) {
  try {
    validator.parse(obj);
    return [];
  } catch (e) {
    if (e instanceof z.ZodError) return [e];
    return [];
  }
}

export function formatValidationErrors(errors: z.ZodError[]) {
  return errors
    .map(error => fromError(error))
    .join('. ')
    .trim();
}

export function getRpcParamErrorsFormatted(obj: unknown, validator: z.ZodTypeAny) {
  return formatValidationErrors(getRpcParamErrors(obj, validator));
}
