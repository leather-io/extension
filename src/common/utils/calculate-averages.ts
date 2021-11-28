import BigNumber from 'bignumber.js';

export function calculateMeanAverage(prices: BigNumber[]) {
  const sum = prices.reduce((acc, price) => acc.plus(price), new BigNumber(0));
  return sum.dividedBy(prices.length).toString();
}
