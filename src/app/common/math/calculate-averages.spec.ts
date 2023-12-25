import BigNumber from 'bignumber.js';

import { calculateMeanAverage } from './calculate-averages';

describe(calculateMeanAverage.name, () => {
  test('it calculates average of 0', () =>
    expect(calculateMeanAverage([]).toString()).toEqual('0'));

  test('it calculates averages of 1', () =>
    expect(calculateMeanAverage([new BigNumber(1)]).toString()).toEqual('1'));

  test('it calculates average of many numbers', () =>
    expect(
      calculateMeanAverage([new BigNumber(1), new BigNumber(2), new BigNumber(3)]).toString()
    ).toEqual('2'));
});
