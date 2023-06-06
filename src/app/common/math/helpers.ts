import BigNumber from 'bignumber.js';

export function initBigNumber(num: string | number | BigNumber) {
  return BigNumber.isBigNumber(num) ? num : new BigNumber(num);
}

export function sumNumbers(nums: number[]) {
  return nums.reduce((acc, num) => acc.plus(num), new BigNumber(0));
}

function isMultipleOf(multiple: number) {
  return (num: number) => num % multiple === 0;
}

export function isEven(num: number) {
  return isMultipleOf(2)(num);
}

export function countDecimals(num: string | number | BigNumber) {
  const LARGE_NUMBER_OF_DECIMALS = 100;
  BigNumber.config({ DECIMAL_PLACES: LARGE_NUMBER_OF_DECIMALS });
  const amount = initBigNumber(num);
  const decimals = amount.toString(10).split('.')[1];
  return decimals ? decimals.length : 0;
}

export function increaseValueByOneMicroStx(value: string | number | BigNumber) {
  return new BigNumber(value).plus(0.000001).toNumber();
}
