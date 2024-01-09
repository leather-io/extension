import BigNumber from 'bignumber.js';

import { initBigNumber } from './helpers';

export function calculateMeanAverage(numbers: BigNumber[] | number[]) {
  if (numbers.length === 0) return new BigNumber(0);
  return numbers
    .map(initBigNumber)
    .reduce((acc, price) => acc.plus(price), new BigNumber(0))
    .dividedBy(numbers.length);
}
