import { hexEncodedStacksTxSchema } from './transaction.utils';

const validHex =
  '0x000000000104052f82abf11c92d3061510cf1d5d854a779a2bd54000000000000000130000000000000bb800000001020025f43f4c5caea4fa791782ca655d1170e9f862b0415122a7de557a81804d7ed72e028e9ed8fc85445c342ccba9749c2ca7282e4e0bb816fcfda821a12bcf14eb00010302000000000005141ab2e8f233b754596b2f079fe49c96af02b83b1b000000000010c8e000000000000000000000000000000000000000000000000000000000000000000000';

describe('hexEncodedStacksTxSchema', () => {
  test('that it validates a valid hex-encoded Stacks transaction', () => {
    const result = hexEncodedStacksTxSchema.safeParse(validHex);
    expect(result.success).toBe(true);
    expect(result.data).toBe(validHex);
  });

  test('that it works with missing 0x prefix', () => {
    const hex = validHex.replace('0x', '');
    const result = hexEncodedStacksTxSchema.safeParse(hex);
    expect(result.success).toBe(true);
  });

  test('that it fails with bad tx', () => {
    const result = hexEncodedStacksTxSchema.safeParse('0xdeadbeefbadhef');
    expect(result.success).toBe(false);
  });
});
