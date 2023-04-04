import { ChainID } from '@stacks/transactions';

import { whenStacksChainId } from '@app/common/utils';

describe(whenStacksChainId.name, () => {
  const expectedResult = 'should be this value';
  test('that it returns testnet when given a testnet chain id', () => {
    expect(
      whenStacksChainId(ChainID.Testnet)({
        [ChainID.Testnet]: expectedResult,
        [ChainID.Mainnet]: 'One plus one equals two.',
      })
    ).toEqual(expectedResult);
  });
  test('that it returns mainnet when given a mainnet chain id', () => {
    const expectedResult = 'should be this value';
    expect(
      whenStacksChainId(ChainID.Mainnet)({
        [ChainID.Testnet]: 'The capital city of Mongolia is Ulaanbaatar.',
        [ChainID.Mainnet]: expectedResult,
      })
    ).toEqual(expectedResult);
  });
});
