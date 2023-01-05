import { HDKey } from '@scure/bip32';
import * as bitcoin from 'bitcoinjs-lib';

function deriveBip32KeychainFromExtendedPublicKey(xpub: string) {
  return HDKey.fromExtendedKey(xpub);
}

export function derivePayToWitnessPublicKeyHashAddressFromXpub(xpub: string, index: number) {
  const keychain = deriveBip32KeychainFromExtendedPublicKey(xpub);
  const zeroAddressIndex = keychain.deriveChild(0).deriveChild(index);
  return bitcoin.payments.p2wpkh({ pubkey: Buffer.from(zeroAddressIndex.publicKey!) }).address;
}
