import BigNumber from 'bignumber.js';

import { Inscription } from '@shared/models/inscription.model';
import { isDefined } from '@shared/utils';

import { PsbtInput } from './use-parsed-inputs';
import { PsbtOutput } from './use-parsed-outputs';

interface FindOutputsReceivingInscriptionsArgs {
  inscriptions: Inscription[];
  psbtInputs: PsbtInput[];
  psbtOutputs: PsbtOutput[];
}
export function findOutputsReceivingInscriptions({
  inscriptions,
  psbtInputs,
  psbtOutputs,
}: FindOutputsReceivingInscriptionsArgs) {
  let inputsSatsTotal = new BigNumber(0);

  return psbtInputs
    .flatMap(input => {
      if (input.inscription) {
        const inscription = inscriptions.find(inscription =>
          input.inscription?.includes(inscription.id)
        );

        // Offset is zero indexed, so 1 is added here to match the sats total
        const inscriptionTotalOffset = inputsSatsTotal.plus(Number(inscription?.offset) + 1);

        let outputsSatsTotal = new BigNumber(0);

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
