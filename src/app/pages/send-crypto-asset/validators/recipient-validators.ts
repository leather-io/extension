import { validate } from 'bitcoin-address-validation';
import * as yup from 'yup';

export function stxAddressValidator() {
  return yup.string().defined();
}

export function btcAddressValidator() {
  return yup
    .string()
    .defined()
    .test((input, context) => {
      if (!input) return false;
      if (!validate(input))
        return context.createError({
          message: 'Invalid bitcoin address',
        });
      return true;
    });
}
