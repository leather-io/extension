import * as yup from 'yup';

import { isNumber, isUndefined } from '@shared/utils';

export const accountSchema = yup.number().integer();

export function validateRpcParams(
  obj: unknown,
  validator: yup.ObjectSchema<yup.Maybe<yup.AnyObject>>
) {
  try {
    validator.validateSync(obj, { abortEarly: false });
    return true;
  } catch (e) {
    return false;
  }
}

export function getRpcParamErrors(
  obj: unknown,
  validator: yup.ObjectSchema<yup.Maybe<yup.AnyObject>>
) {
  try {
    validator.validateSync(obj, { abortEarly: false });
    return [];
  } catch (e) {
    if (e instanceof yup.ValidationError) return e.inner;
    return [];
  }
}

export function formatValidationErrors(errors: yup.ValidationError[]) {
  return (
    'Invalid parameters: ' + errors.map(e => `Error in path ${e.path}, ${e.message}.`).join(' ')
  );
}

export function testIsNumberOrArrayOfNumbers(value: unknown) {
  if (isUndefined(value)) return true;
  if (Array.isArray(value)) return value.every(item => isNumber(item));
  return isNumber(value);
}
