import { HDKey } from '@scure/bip32';
import * as btc from 'micro-btc-signer';

function deriveBip32KeychainFromExtendedPublicKey(xpub: string) {
  return HDKey.fromExtendedKey(xpub);
}

export function derivePayToWitnessPublicKeyHashAddressFromXpub(xpub: string, index: number) {
  const keychain = deriveBip32KeychainFromExtendedPublicKey(xpub);
  const zeroAddressIndex = keychain.deriveChild(0).deriveChild(index);
  return btc.p2wpkh(zeroAddressIndex.publicKey!).address;
}
