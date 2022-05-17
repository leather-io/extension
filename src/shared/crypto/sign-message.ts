import { SignatureData } from '@stacks/connect';
import { hashMessage } from '@stacks/encryption';
import {
  getPublicKey,
  publicKeyToString,
  signWithKey,
  StacksPrivateKey,
} from '@stacks/transactions';

function convertSignatureVrsToRsvFormat(sig: string) {
  return Buffer.from(sig.slice(2) + sig.slice(0, 2), 'hex').toString('hex');
}

export function signMessage(message: string, privateKey: StacksPrivateKey): SignatureData {
  const hash = hashMessage(message);
  const signatureVrs = signWithKey(privateKey, hash.toString('hex')).data;
  const signatureRsv = convertSignatureVrsToRsvFormat(signatureVrs);
  return {
    signature: signatureRsv,
    publicKey: publicKeyToString(getPublicKey(privateKey)),
  };
}
