import { createStacksPrivateKey, getPublicKey, publicKeyToString } from '@stacks/transactions';

export function derivePublicKey(key: string) {
  return publicKeyToString(getPublicKey(createStacksPrivateKey(key)));
}
