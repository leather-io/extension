import BigNumber from 'bignumber.js';

export function calculateMeanAverage(numbers: BigNumber[]) {
  return numbers
    .reduce((acc, price) => acc.plus(price), new BigNumber(0))
    .dividedBy(numbers.length);
}
