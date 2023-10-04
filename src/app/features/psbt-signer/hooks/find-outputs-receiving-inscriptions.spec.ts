import { mockInscription1, mockInscription2 } from '@tests/mocks/mock-inscriptions';
import {
  mockPsbtInputs1,
  mockPsbtInputs2,
  mockPsbtOutputs1,
  mockPsbtOutputs2,
} from '@tests/mocks/mock-psbts';

import { findOutputsReceivingInscriptions } from './find-outputs-receiving-inscriptions';

describe('find outputs receiving inscriptions', () => {
  test('that the correct output receives the inscription (scenario 1)', () => {
    const outputsReceivingInscriptions = findOutputsReceivingInscriptions({
      psbtInputs: mockPsbtInputs1,
      psbtOutputs: mockPsbtOutputs1,
    });
    expect(outputsReceivingInscriptions[0]).toEqual({
      address: 'bc1p9pnzvq52956jht5deha82qp96pxw0a0tvey6fhdea7vwhf33tarskqq3nr',
      inscription: mockInscription1,
    });
  });

  test('that the correct output receives the inscription (scenario 2)', () => {
    const outputsReceivingInscriptions = findOutputsReceivingInscriptions({
      psbtInputs: mockPsbtInputs2,
      psbtOutputs: mockPsbtOutputs2,
    });
    expect(outputsReceivingInscriptions[0]).toEqual({
      address: 'bc1p9pnzvq52956jht5deha82qp96pxw0a0tvey6fhdea7vwhf33tarskqq3nr',
      inscription: mockInscription2,
    });
  });
});
