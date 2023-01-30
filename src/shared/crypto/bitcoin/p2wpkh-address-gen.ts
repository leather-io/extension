import { HDKey } from '@scure/bip32';
import * as btc from 'micro-btc-signer';

export function deriveNativeSegWitAccountFromHdKey(keychain: HDKey) {
  return (index: number) => keychain.derive(`m/84'/0'/${index}'`);
}

function deriveBip32KeychainFromExtendedPublicKey(xpub: string) {
  return HDKey.fromExtendedKey(xpub);
}

export function deriveNativeSegWitAddressFromXpub(xpub: string, index: number) {
  const keychain = deriveBip32KeychainFromExtendedPublicKey(xpub);
  const zeroAddressIndex = keychain.deriveChild(0).deriveChild(index);
  return btc.p2wpkh(zeroAddressIndex.publicKey!).address;
}
