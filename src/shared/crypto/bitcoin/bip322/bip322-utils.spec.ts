import { hexToBytes, utf8ToBytes } from '@noble/hashes/utils';

import { hashBip322Message } from './bip322-utils';

describe('Message hashing', () => {
  test('empty string', () =>
    expect(hashBip322Message(utf8ToBytes(''))).toEqual(
      hexToBytes('c90c269c4f8fcbe6880f72a721ddfbf1914268a794cbb21cfafee13770ae19f1')
    ));

  const helloWorld = 'Hello World';

  test(helloWorld, () =>
    expect(hashBip322Message(utf8ToBytes(helloWorld))).toEqual(
      hexToBytes('f0eb03b1a75ac6d9847f55c624a99169b5dccba2a31f5b23bea77ba270de0a7a')
    )
  );
});
