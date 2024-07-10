import * as yup from 'yup';

import type { NetworkConfiguration } from '@leather.io/models';
import { isEmptyString, isUndefined } from '@leather.io/utils';

import { FormErrorMessages } from '@shared/error-messages';

import { validateAddressChain, validateStacksAddress } from '@app/common/stacks-utils';

function notCurrentAddressValidatorFactory(currentAddress: string) {
  return (value?: string) => value !== currentAddress;
}

export function notCurrentAddressValidator(currentAddress: string) {
  return yup.string().test({
    message: FormErrorMessages.SameAddress,
    test: notCurrentAddressValidatorFactory(currentAddress),
  });
}

function stxAddressNetworkValidatorFactory(currentNetwork: NetworkConfiguration) {
  return (value?: string) => {
    if (isUndefined(value) || isEmptyString(value)) return true;
    return validateAddressChain(value, currentNetwork);
  };
}

export function stxAddressNetworkValidator(currentNetwork: NetworkConfiguration) {
  return yup.string().test({
    message: FormErrorMessages.IncorrectNetworkAddress,
    test: stxAddressNetworkValidatorFactory(currentNetwork),
  });
}

export function stxAddressValidator(errorMsg: string) {
  return yup.string().test({
    message: errorMsg,
    test(value) {
      if (isUndefined(value) || isEmptyString(value)) return true;
      return validateStacksAddress(value);
    },
  });
}
