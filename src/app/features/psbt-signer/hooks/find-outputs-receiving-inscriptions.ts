import BigNumber from 'bignumber.js';

import { isDefined } from '@leather.io/utils';

import { PsbtInput } from './use-parsed-inputs';
import { PsbtOutput } from './use-parsed-outputs';

interface FindOutputsReceivingInscriptionsArgs {
  psbtInputs: PsbtInput[];
  psbtOutputs: PsbtOutput[];
}
// If an input has an inscription, we use the offset to determine where it matches
// up from total input sats position to total output sats position. By doing this,
// we can predict where the inscription will be sent.
export function findOutputsReceivingInscriptions({
  psbtInputs,
  psbtOutputs,
}: FindOutputsReceivingInscriptionsArgs) {
  let inputsSatsTotal = new BigNumber(0);

  return psbtInputs
    .flatMap(input => {
      if (isDefined(input.inscription)) {
        // Offset is zero indexed, so 1 is added here to match the sats total
        const inscriptionTotalOffset = inputsSatsTotal.plus(Number(input.inscription.offset) + 1);

        let outputsSatsTotal = new BigNumber(0);

        // Add up all the output sats until the inscription is included in the output total.
        // This should also detect if an inscription is being lost to fees bc the outputs will
        // never add up to include the inscription, therefore it won't be shown.
        for (let output = 0; output < psbtOutputs.length; output++) {
          outputsSatsTotal = outputsSatsTotal.plus(psbtOutputs[output].value);
          if (inscriptionTotalOffset.isLessThanOrEqualTo(outputsSatsTotal))
            return { address: psbtOutputs[output].address, inscription: input.inscription };
        }
      }
      inputsSatsTotal = inputsSatsTotal.plus(input.value);
      return;
    })
    .filter(isDefined);
}
