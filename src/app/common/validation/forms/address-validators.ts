import validate, { Network } from 'bitcoin-address-validation';
import * as yup from 'yup';

import { NetworkConfiguration, NetworkModes } from '@shared/constants';
import { isString } from '@shared/utils';

import { validateAddressChain, validateStacksAddress } from '@app/common/stacks-utils';

export function btcAddressValidator() {
  return yup
    .string()
    .defined('Enter a bitcoin address')
    .test((input, context) => {
      if (!input) return false;
      if (!validate(input))
        return context.createError({
          message: 'Invalid bitcoin address',
        });
      return true;
    });
}

function btcAddressNetworkValidatorFactory(network: NetworkModes) {
  return (value?: string) => {
    if (!isString(value)) return false;
    return validate(value, network as Network);
  };
}

export function btcAddressNetworkValidator(network: NetworkModes) {
  return yup.string().test({
    test: btcAddressNetworkValidatorFactory(network),
    message: 'Bitcoin address targets different network',
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
