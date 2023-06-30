import { HDKey } from '@scure/bip32';
import { mnemonicToSeedSync } from '@scure/bip39';
import { deriveSalt } from '@stacks/wallet-sdk';

import { DATA_DERIVATION_PATH, deriveStacksSalt } from './stacks-address-gen';

describe(deriveStacksSalt.name, () => {
  test('it makes the same hash as wallet sdk', async () => {
    const seed = mnemonicToSeedSync(
      'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat'
    );
    const keychain = HDKey.fromMasterSeed(seed);

    const result = deriveStacksSalt(keychain.derive(DATA_DERIVATION_PATH));

    const walletSdkResult = await deriveSalt(keychain as any);

    expect(result).toEqual(walletSdkResult);
  });
});
