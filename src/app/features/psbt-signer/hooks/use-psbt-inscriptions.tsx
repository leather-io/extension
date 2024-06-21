import { useMemo } from 'react';

import { isDefined } from '@leather.io/utils';

import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountTaprootIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';

import { findOutputsReceivingInscriptions } from './find-outputs-receiving-inscriptions';
import { PsbtInput } from './use-parsed-inputs';
import { PsbtOutput } from './use-parsed-outputs';

export function usePsbtInscriptions(psbtInputs: PsbtInput[], psbtOutputs: PsbtOutput[]) {
  const bitcoinAddressNativeSegwit = useCurrentAccountNativeSegwitIndexZeroSigner().address;
  const { address: bitcoinAddressTaproot } = useCurrentAccountTaprootIndexZeroSigner();

  const outputsReceivingInscriptions = useMemo(
    () =>
      findOutputsReceivingInscriptions({
        psbtInputs,
        psbtOutputs,
      }),
    [psbtInputs, psbtOutputs]
  );

  return useMemo(() => {
    const accountInscriptionsBeingTransferred = psbtInputs
      .filter(
        input =>
          input.address === bitcoinAddressNativeSegwit || input.address === bitcoinAddressTaproot
      )
      .map(input => input.inscription)
      .filter(isDefined);

    const accountInscriptionsBeingReceived = outputsReceivingInscriptions
      .filter(
        outputWithInscription =>
          outputWithInscription.address === bitcoinAddressNativeSegwit ||
          outputWithInscription.address === bitcoinAddressTaproot
      )
      .map(input => input.inscription)
      .filter(
        inscription =>
          !accountInscriptionsBeingTransferred.find(
            transferInscription => inscription.id === transferInscription.id
          )
      )
      .filter(isDefined);

    return {
      accountInscriptionsBeingTransferred,
      accountInscriptionsBeingReceived,
    };
  }, [bitcoinAddressNativeSegwit, bitcoinAddressTaproot, outputsReceivingInscriptions, psbtInputs]);
}
