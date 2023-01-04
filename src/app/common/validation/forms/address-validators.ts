import validate from 'bitcoin-address-validation';
import * as yup from 'yup';

import { NetworkConfiguration } from '@shared/constants';
import { isString } from '@shared/utils';

import { validateAddressChain, validateStacksAddress } from '@app/common/stacks-utils';

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

export function stxAddressNetworkValidatorFactory(currentNetwork: NetworkConfiguration) {
  return (value: unknown) => {
    if (!isString(value)) return false;
    return validateAddressChain(value, currentNetwork);
  };
}

export function stxNotCurrentAddressValidatorFactory(currentAddress: string) {
  return (value: unknown) => value !== currentAddress;
}

export function stxAddressValidator(errorMsg: string) {
  return yup.string().test({
    message: errorMsg,
    test(value: unknown) {
      if (!isString(value)) return false;
      return validateStacksAddress(value);
    },
  });
}
