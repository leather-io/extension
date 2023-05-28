import BigNumber from 'bignumber.js';

import { sumNumbers } from './helpers';

const cases = [
  {
    sums: [1, 2, 3],
    expectedResult: new BigNumber(6),
  },
  {
    sums: [0.1, 0.2],
    expectedResult: new BigNumber(0.3),
  },
  {
    sums: [Number.MAX_SAFE_INTEGER, 1],
    expectedResult: new BigNumber('9007199254740992'),
  },
];

describe(sumNumbers.name, () => {
  describe.each(cases)('Sum example', ({ sums, expectedResult }) => {
    test('sum of ' + sums.toString(), () => {
      expect(sumNumbers(sums).toString()).toEqual(expectedResult.toString());
    });
  });
});
