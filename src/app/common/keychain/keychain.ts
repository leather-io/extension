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

function mnemonicToRootNode(secretKey: string) {
  const seed = mnemonicToSeedSync(secretKey);
  return HDKey.fromMasterSeed(seed);
}

export function getStacksAddressByIndex(secretKey: string, addressVersion: AddressVersion) {
  return (index: number) => {
    const accountPrivateKey = createStacksPrivateKey(
      // Typecast fixed in https://github.com/hirosystems/stacks.js/pull/1434
      deriveStxPrivateKey({ rootNode: mnemonicToRootNode(secretKey) as any, index })
    );
    const pubKey = getPublicKey(accountPrivateKey);
    return publicKeyToAddress(addressVersion, pubKey);
  };
}
