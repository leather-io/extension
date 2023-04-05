import * as btc from '@scure/btc-signer';

import { isDefined } from '@shared/utils';

import { PsbtInputForUi } from './use-psbt-decoded-request';

export interface InputsOutputPair {
  inputs: PsbtInputForUi[];
  output: btc.TransactionOutputRequired;
}

function consolidateInputsWithSameAddress(inputs: PsbtInputForUi[]): PsbtInputForUi[] {
  const utxo: Record<string, PsbtInputForUi> = {};
  inputs.forEach(({ address, value, ...rest }) => {
    if (isDefined(utxo[address])) {
      utxo[address] = {
        ...utxo[address],
        value: utxo[address].value + value,
      };
    } else {
      utxo[address] = { address, value, ...rest };
    }
  });
  return Object.values(utxo);
}

interface MatchInputsOutputsArgs {
  psbtInputs: PsbtInputForUi[];
  unsignedOutputs: btc.TransactionOutputRequired[];
}
export function matchInputsOutputs({ psbtInputs, unsignedOutputs }: MatchInputsOutputsArgs): {
  fee: number;
  inputOutputPairs: InputsOutputPair[];
} {
  const pairs: InputsOutputPair[] = [];
  const availableInputs = [...psbtInputs];
  // Keep track of the input value available across multiple outputs
  let remainingInputValue = 0;

  for (const output of unsignedOutputs) {
    // Note here that the inputs/output `pair` uses an inputs array so
    // multiple inputs can be used to fulfill an output
    const inputsOutputPair: InputsOutputPair = {
      inputs: [],
      output: output,
    };

    // Calculate the remaining value needed for this output
    let remainingOutputValue = Number(output.amount);

    // Iterate through the available inputs and add them until the output is fulfilled
    for (let i = 0; i < availableInputs.length; i++) {
      const input = availableInputs[i];

      if (remainingInputValue === 0) remainingInputValue = input.value;

      if (input.value <= remainingOutputValue) {
        // Use this entire input and subtract from output value
        inputsOutputPair.inputs.push(input);
        remainingOutputValue -= input.value;
        remainingInputValue = 0;
        availableInputs.splice(i, 1);
        i--;
      } else {
        // Use this input but keep track of remainder for future outputs
        remainingInputValue -= remainingOutputValue;
        inputsOutputPair.inputs.push(input);
        remainingOutputValue = 0;
      }

      if (remainingOutputValue === 0) break;
    }

    pairs.push(inputsOutputPair);
  }

  const inputOutputPairs: InputsOutputPair[] = pairs.map(pair => {
    return { inputs: consolidateInputsWithSameAddress(pair.inputs), output: pair.output };
  });

  return { fee: remainingInputValue, inputOutputPairs };
}
