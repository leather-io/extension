import {
  AddressVersion,
  createStacksPrivateKey,
  getPublicKey,
  publicKeyToAddress,
} from '@stacks/transactions';
import { deriveStxPrivateKey } from '@stacks/wallet-sdk';

import { mnemonicToRootNode } from '@app/common/keychain/keychain';

export function getStacksAddressByIndex(secretKey: string, addressVersion: AddressVersion) {
  return (index: number) => {
    const accountPrivateKey = createStacksPrivateKey(
      deriveStxPrivateKey({ rootNode: mnemonicToRootNode(secretKey) as any, index })
    );
    const pubKey = getPublicKey(accountPrivateKey);
    return publicKeyToAddress(addressVersion, pubKey);
  };
}
