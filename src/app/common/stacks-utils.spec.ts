import { TEST_ACCOUNT_1_STX_ADDRESS, TEST_ACCOUNT_2_STX_ADDRESS } from '@tests/mocks/constants';

import { isFtNameLikeStx, stacksValue, validateStacksAddress } from '@app/common/stacks-utils';

const uSTX_AMOUNT = 10000480064; // 10,000.480064

const longContractPrincipalName = 'thisIsAReally-LongAndHenceInvalidName_Seriously';

describe('stacksValue tests', () => {
  test('no extra params', () => {
    const value = stacksValue({
      value: uSTX_AMOUNT,
    });
    expect(value).toEqual('10,000.480064 STX');
  });
  test('without ticker', () => {
    const value = stacksValue({
      value: uSTX_AMOUNT,
      withTicker: false,
    });
    expect(value).toEqual('10,000.480064');
  });
  test('without fixed decimals', () => {
    const value = stacksValue({
      value: uSTX_AMOUNT,
      fixedDecimals: false,
    });
    expect(value).toEqual('10,000.48 STX');
  });
  test('abbreviated', () => {
    const value = stacksValue({
      value: uSTX_AMOUNT,
      abbreviate: true,
    });
    expect(value).toEqual('10K STX');
  });
});

describe(isFtNameLikeStx.name, () => {
  it('detect impersonating token names', () => {
    expect(isFtNameLikeStx('STX')).toBeTruthy();
    expect(isFtNameLikeStx('stx')).toBeTruthy();
    expect(isFtNameLikeStx('stacks')).toBeTruthy();
    expect(isFtNameLikeStx('Stäcks')).toBeTruthy();
    expect(isFtNameLikeStx('Stácks')).toBeTruthy();
    expect(isFtNameLikeStx('Stáçks')).toBeTruthy();
    expect(isFtNameLikeStx('stocks')).toBeFalsy();
    expect(isFtNameLikeStx('miamicoin')).toBeFalsy();
    expect(isFtNameLikeStx('')).toBeFalsy();
  });
});

describe('validateStacksAddress', () => {
  it('validates stacks addresses correctly', () => {
    expect(validateStacksAddress(TEST_ACCOUNT_1_STX_ADDRESS)).toBeTruthy();
    expect(validateStacksAddress(TEST_ACCOUNT_2_STX_ADDRESS)).toBeTruthy();

    expect(validateStacksAddress('invalid-address')).toBeFalsy();
    expect(validateStacksAddress('')).toBeFalsy();
  });
  it('validates stacks addresses with contract principals correctly', () => {
    expect(validateStacksAddress(`${TEST_ACCOUNT_1_STX_ADDRESS}.contract-name`)).toBeTruthy();
    expect(validateStacksAddress(`${TEST_ACCOUNT_1_STX_ADDRESS}.contract_name`)).toBeTruthy();

    expect(
      validateStacksAddress(`${TEST_ACCOUNT_1_STX_ADDRESS}.${longContractPrincipalName}`)
    ).toBeFalsy();

    expect(validateStacksAddress(`${TEST_ACCOUNT_1_STX_ADDRESS}.`)).toBeFalsy();
    expect(validateStacksAddress('c.-')).toBeFalsy();
    expect(validateStacksAddress('invalid-address')).toBeFalsy();
    expect(validateStacksAddress(`${TEST_ACCOUNT_1_STX_ADDRESS}.invalid!`)).toBeFalsy();
  });
});
