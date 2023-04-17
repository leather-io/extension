import {
  mockInputOutputPairs,
  mockInputOutputPairsWithNonWitnessOnly,
  mockPsbtInputs,
  mockPsbtInputsWithNonWitnessOnly,
  mockPsbtUnsignedOutputs,
} from '@tests/mocks/mock-psbts';

import { matchInputsOutputs } from './match-inputs-and-outputs';

describe('matching psbt inputs and outputs', () => {
  test('that psbt inputs and outputs can be paired correctly when witness data is provided', () => {
    const { inputOutputPairs } = matchInputsOutputs({
      psbtInputs: mockPsbtInputs,
      unsignedOutputs: mockPsbtUnsignedOutputs,
    });
    expect(inputOutputPairs).toEqual(mockInputOutputPairs);
  });

  test('that psbt inputs and outputs can be paired correctly when only non-witness data is provided', () => {
    const { inputOutputPairs } = matchInputsOutputs({
      psbtInputs: mockPsbtInputsWithNonWitnessOnly,
      unsignedOutputs: mockPsbtUnsignedOutputs,
    });
    expect(inputOutputPairs).toEqual(mockInputOutputPairsWithNonWitnessOnly);
  });
});
