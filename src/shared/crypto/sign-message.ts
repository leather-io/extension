import { SignatureData } from '@stacks/connect';
import { hashMessage } from '@stacks/encryption';
import {
  getPublicKey,
  publicKeyToString,
  signWithKey,
  StacksPrivateKey,
} from '@stacks/transactions';

export function signMessage(message: string, privateKey: StacksPrivateKey): SignatureData {
  const hash = hashMessage(message);
  return {
    signature: signWithKey(privateKey, hash.toString('hex')).data,
    publicKey: publicKeyToString(getPublicKey(privateKey)),
  };
}
