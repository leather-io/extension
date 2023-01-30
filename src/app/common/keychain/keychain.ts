import { HDKey } from '@scure/bip32';
import { mnemonicToSeedSync } from '@scure/bip39';
import { createStacksPrivateKey, getPublicKey, publicKeyToString } from '@stacks/transactions';

export function derivePublicKey(key: string) {
  return publicKeyToString(getPublicKey(createStacksPrivateKey(key)));
}

export function mnemonicToRootNode(secretKey: string) {
  const seed = mnemonicToSeedSync(secretKey);
  return HDKey.fromMasterSeed(seed);
}
