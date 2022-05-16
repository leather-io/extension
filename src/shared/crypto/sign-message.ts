import { hashMessage } from '@stacks/encryption';
import {
  getPublicKey,
  publicKeyToString,
  signWithKey,
  StacksPrivateKey,
} from '@stacks/transactions';

export interface SignatureData {
  signature: string; // - Hex encoded DER signature
  publicKey: string; // - Hex encoded private string taken from privateKey
}

export function signMessage(message: string, privateKey: StacksPrivateKey): SignatureData {
  const hash = hashMessage(message);
  return {
    signature: signWithKey(privateKey, hash.toString('hex')).data,
    publicKey: publicKeyToString(getPublicKey(privateKey)),
  };
}
