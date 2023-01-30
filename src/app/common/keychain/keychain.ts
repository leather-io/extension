import { HDKey } from '@scure/bip32';
import { mnemonicToSeedSync } from '@scure/bip39';
import {
  AddressVersion,
  createStacksPrivateKey,
  getPublicKey,
  publicKeyToAddress,
  publicKeyToString,
} from '@stacks/transactions';
import { deriveStxPrivateKey } from '@stacks/wallet-sdk';

export function derivePublicKey(key: string) {
  return publicKeyToString(getPublicKey(createStacksPrivateKey(key)));
}

export function mnemonicToRootNode(secretKey: string) {
  const seed = mnemonicToSeedSync(secretKey);
  return HDKey.fromMasterSeed(seed);
}

export function getStacksAddressByIndex(secretKey: string, addressVersion: AddressVersion) {
  return (index: number) => {
    const accountPrivateKey = createStacksPrivateKey(
      deriveStxPrivateKey({ rootNode: mnemonicToRootNode(secretKey), index })
    );
    const pubKey = getPublicKey(accountPrivateKey);
    return publicKeyToAddress(addressVersion, pubKey);
  };
}
