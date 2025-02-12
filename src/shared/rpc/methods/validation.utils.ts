import { z } from 'zod';
import { fromError } from 'zod-validation-error';

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
