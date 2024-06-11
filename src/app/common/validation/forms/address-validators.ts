import { AddressType, Network, getAddressInfo, validate } from 'bitcoin-address-validation';
import * as yup from 'yup';

import type { BitcoinNetworkModes, NetworkConfiguration } from '@leather-wallet/models';
import { isString } from '@leather-wallet/utils';

import { FormErrorMessages } from '@shared/error-messages';

import { validateAddressChain, validateStacksAddress } from '@app/common/stacks-utils';

function notCurrentAddressValidatorFactory(currentAddress: string) {
  return (value: unknown) => value !== currentAddress;
}

export function notCurrentAddressValidator(currentAddress: string) {
  return yup.string().test({
    message: FormErrorMessages.SameAddress,
    test: notCurrentAddressValidatorFactory(currentAddress),
  });
}

export function btcAddressValidator() {
  return yup
    .string()
    .defined(FormErrorMessages.AddressRequired)
    .test((input, context) => {
      if (!input) return false;
      if (!validate(input))
        return context.createError({
          message: FormErrorMessages.InvalidAddress,
        });
      return true;
    });
}

// ts-unused-exports:disable-next-line
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

function btcAddressNetworkValidatorFactory(network: BitcoinNetworkModes) {
  function getAddressNetworkType(network: BitcoinNetworkModes): Network {
    // Signet uses testnet address format, this parsing is to please the
    // validation library
    if (network === 'signet') return Network.testnet;
    return network as Network;
  }

  return (value?: string) => {
    if (!isString(value)) return false;
    return validate(value, getAddressNetworkType(network));
  };
}

export function btcAddressNetworkValidator(network: BitcoinNetworkModes) {
  return yup.string().test({
    test: btcAddressNetworkValidatorFactory(network),
    message: FormErrorMessages.IncorrectNetworkAddress,
  });
}

function stxAddressNetworkValidatorFactory(currentNetwork: NetworkConfiguration) {
  return (value: unknown) => {
    if (!isString(value)) return false;
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
  return yup
    .string()
    .defined(FormErrorMessages.AddressRequired)
    .test({
      message: errorMsg,
      test(value: unknown) {
        if (!isString(value)) return false;
        return validateStacksAddress(value);
      },
    });
}
