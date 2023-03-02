import { AddressType, Network, getAddressInfo, validate } from 'bitcoin-address-validation';
import * as yup from 'yup';

import { NetworkConfiguration, NetworkModes } from '@shared/constants';
import { isString } from '@shared/utils';

import { FormErrorMessages } from '@app/common/error-messages';
import { validateAddressChain, validateStacksAddress } from '@app/common/stacks-utils';

function notCurrentAddressValidatorFactory(currentAddress: string) {
  return (value: unknown) => value !== currentAddress;
}

export function notCurrentAddressValidator(currentAddress: string) {
  return yup.string().test({
    test: notCurrentAddressValidatorFactory(currentAddress),
    message: FormErrorMessages.SameAddress,
  });
}

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
export function btcTaprootAddressValidator() {
  return yup.string().test((input, context) => {
    if (!input || !validate(input)) return false;
    if (getAddressInfo(input).type !== AddressType.p2tr)
      return context.createError({
        message: 'Only taproot addresses are supported',
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

export function stxAddressValidator(errorMsg: string) {
  return yup.string().test({
    message: errorMsg,
    test(value: unknown) {
      if (!isString(value)) return false;
      return validateStacksAddress(value);
    },
  });
}
