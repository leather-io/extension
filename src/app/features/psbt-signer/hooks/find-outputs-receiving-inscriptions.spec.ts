import {
  mockInscriptions1,
  mockInscriptions2,
  mockPsbtInputs1,
  mockPsbtInputs2,
  mockPsbtOutputs1,
  mockPsbtOutputs2,
} from '@tests/mocks/mock-psbts';

import { findOutputsReceivingInscriptions } from './find-outputs-receiving-inscriptions';

describe('find outputs receiving inscriptions', () => {
  test('that the correct output receives the inscription (scenario 1)', () => {
    const outputsReceivingInscriptions = findOutputsReceivingInscriptions({
      inscriptions: mockInscriptions1,
      psbtInputs: mockPsbtInputs1,
      psbtOutputs: mockPsbtOutputs1,
    });
    expect(outputsReceivingInscriptions[0]).toEqual({
      address: 'bc1p9pnzvq52956jht5deha82qp96pxw0a0tvey6fhdea7vwhf33tarskqq3nr',
      inscription:
        '/inscription/ba39f922074c0d338a13ac10e770a5da47ce09df8310c8d3cfaec13a347e8202i0',
    });
  });

  test('that the correct output receives the inscription (scenario 2)', () => {
    const outputsReceivingInscriptions = findOutputsReceivingInscriptions({
      inscriptions: mockInscriptions2,
      psbtInputs: mockPsbtInputs2,
      psbtOutputs: mockPsbtOutputs2,
    });
    expect(outputsReceivingInscriptions[0]).toEqual({
      address: 'bc1p9pnzvq52956jht5deha82qp96pxw0a0tvey6fhdea7vwhf33tarskqq3nr',
      inscription:
        '/inscription/ba39f922074c0d338a13ac10e770a5da47ce09df8310c8d3cfaec13a347e8202i0',
    });
  });
});
