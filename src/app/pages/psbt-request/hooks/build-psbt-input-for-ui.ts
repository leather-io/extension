import { BitcoinNetworkModes } from '@shared/constants';
import { getAddressFromOutScript } from '@shared/crypto/bitcoin/bitcoin.utils';
import { isDefined } from '@shared/utils';

import { OrdApiInscriptionTxOutput } from '@app/query/bitcoin/ordinals/ordinals-aware-utxo.query';

import { PsbtInput, PsbtInputForUi } from './use-psbt-decoded-request';

function getPsbtInputValue(input: PsbtInput, unsignedUtxo?: OrdApiInscriptionTxOutput) {
  if (isDefined(input.witnessUtxo)) return Number(input.witnessUtxo.amount);
  if (isDefined(input.nonWitnessUtxo) && isDefined(unsignedUtxo)) return Number(unsignedUtxo.value);
  return 0;
}

function getPsbtInputAddress(
  input: PsbtInput,
  network: BitcoinNetworkModes,
  unsignedUtxo?: OrdApiInscriptionTxOutput
) {
  if (isDefined(input.witnessUtxo))
    return getAddressFromOutScript(input.witnessUtxo.script, network);
  if (isDefined(input.nonWitnessUtxo) && isDefined(unsignedUtxo)) return unsignedUtxo.address ?? '';
  return '';
}

interface BuildPsbtInputForUiArgs {
  network: BitcoinNetworkModes;
  psbtInputs: PsbtInput[];
  unsignedUtxos: (OrdApiInscriptionTxOutput | undefined)[];
}
export function buildPsbtInputsForUi({
  network,
  psbtInputs,
  unsignedUtxos,
}: BuildPsbtInputForUiArgs): PsbtInputForUi[] {
  return psbtInputs.map((input, i) => {
    const utxoAddress = getPsbtInputAddress(input, network, unsignedUtxos[i]);
    const utxoValue = getPsbtInputValue(input, unsignedUtxos[i]);
    return {
      ...input,
      address: utxoAddress,
      value: utxoValue,
      unsignedUtxo: unsignedUtxos[i],
    };
  });
}
