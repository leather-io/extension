import { ChainID } from '@stacks/transactions';

import { whenStxChainId } from '@app/common/utils';

describe(whenStxChainId.name, () => {
  const expectedResult = 'should be this value';
  test('that it returns testnet when given a testnet chain id', () => {
    expect(
      whenStxChainId(ChainID.Testnet)({
        [ChainID.Testnet]: expectedResult,
        [ChainID.Mainnet]: 'One plus one equals two.',
      })
    ).toEqual(expectedResult);
  });
  test('that it returns mainnet when given a mainnet chain id', () => {
    const expectedResult = 'should be this value';
    expect(
      whenStxChainId(ChainID.Mainnet)({
        [ChainID.Testnet]: 'The capital city of Mongolia is Ulaanbaatar.',
        [ChainID.Mainnet]: expectedResult,
      })
    ).toEqual(expectedResult);
  });
});
