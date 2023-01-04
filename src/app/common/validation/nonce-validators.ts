import * as yup from 'yup';

export const nonceValidator = yup
  .number()
  .integer()
  .min(0, 'Nonce must be zero or more')
  .typeError('Nonce must be a positive integer or 0');
