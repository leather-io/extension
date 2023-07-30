import { useMemo } from 'react';

import { isDefined } from '@shared/utils';

import { useGetInscriptionQueries } from '@app/query/bitcoin/ordinals/inscription.query';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountTaprootIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';

import { findOutputsReceivingInscriptions } from './find-outputs-receiving-inscriptions';
import { PsbtInput } from './use-parsed-inputs';
import { PsbtOutput } from './use-parsed-outputs';

export function usePsbtInscriptions(psbtInputs: PsbtInput[], psbtOutputs: PsbtOutput[]) {
  const bitcoinAddressNativeSegwit = useCurrentAccountNativeSegwitIndexZeroSigner().address;
  const { address: bitcoinAddressTaproot } = useCurrentAccountTaprootIndexZeroSigner();
  const inscriptions = useGetInscriptionQueries(
    psbtInputs.map(utxo => utxo.inscription?.replace('/inscription/', '') ?? '')
  )
    .map(query => query.data)
    .filter(isDefined);

  const outputsReceivingInscriptions = useMemo(
    () =>
      findOutputsReceivingInscriptions({
        inscriptions,
        psbtInputs,
        psbtOutputs,
      }),
    [inscriptions, psbtInputs, psbtOutputs]
  );

  return useMemo(
    () => ({
      accountInscriptionsBeingTransferred: psbtInputs
        .filter(
          input =>
            input.address === bitcoinAddressNativeSegwit || input.address === bitcoinAddressTaproot
        )
        .map(input => input.inscription)
        .filter(isDefined),
      accountInscriptionsBeingReceived: outputsReceivingInscriptions
        .filter(
          outputWithInscription =>
            outputWithInscription.address === bitcoinAddressNativeSegwit ||
            outputWithInscription.address === bitcoinAddressTaproot
        )
        .map(input => input.inscription)
        .filter(isDefined),
    }),
    [bitcoinAddressNativeSegwit, bitcoinAddressTaproot, outputsReceivingInscriptions, psbtInputs]
  );
}
