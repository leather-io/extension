import { signECDSA, hashMessage } from '@stacks/encryption';
import { StacksPrivateKey } from '@stacks/transactions';

export interface SignatureData {
  signature: string; // - Hex encoded DER signature
  publicKey: string; // - Hex encoded private string taken from privateKey
}

export function signMessage(message: string, privateKey: StacksPrivateKey): SignatureData {
  const privateKeyUncompressed = privateKey.data.slice(0, 32);
  const hash = hashMessage(message);
  return signECDSA(privateKeyUncompressed.toString('hex'), hash);
}
