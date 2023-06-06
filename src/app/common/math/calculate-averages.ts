import BigNumber from 'bignumber.js';

import { initBigNumber } from './helpers';

export function calculateMeanAverage(numbers: BigNumber[] | number[]) {
  return numbers
    .map(initBigNumber)
    .reduce((acc, price) => acc.plus(price), new BigNumber(0))
    .dividedBy(numbers.length);
}
