import { AddressType, Network, getAddressInfo, validate } from 'bitcoin-address-validation';
import * as yup from 'yup';

import type { BitcoinNetworkModes } from '@leather-wallet/models';
import { isString } from '@leather-wallet/utils';

import { FormErrorMessages } from '@shared/error-messages';

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
