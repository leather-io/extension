import { hexToBytes } from '@noble/hashes/utils';
import { HDKey } from '@scure/bip32';
import * as btc from '@scure/btc-signer';

import { NetworkModes } from '@shared/constants';

import { DerivationPathDepth } from '../derivation-path.utils';

const coinTypeMap: Record<NetworkModes, 0 | 1> = {
  mainnet: 0,
  testnet: 1,
};

export function getBitcoinCoinTypeIndexByNetwork(network: NetworkModes) {
  return coinTypeMap[network];
}

export function deriveAddressIndexKeychainFromAccount(keychain: HDKey) {
  if (keychain.depth !== DerivationPathDepth.Account)
    throw new Error('Keychain passed is not an account');

  return (index: number) => keychain.deriveChild(0).deriveChild(index);
}

export function deriveAddressIndexZeroFromAccount(keychain: HDKey) {
  return deriveAddressIndexKeychainFromAccount(keychain)(0);
}

const ecdsaPublicKeyLength = 33;

export function ecdsaPublicKeyToSchnorr(pubKey: Uint8Array) {
  if (pubKey.byteLength !== ecdsaPublicKeyLength) throw new Error('Invalid public key length');
  return pubKey.slice(1);
}

export function decodeBitcoinTx(tx: string) {
  return btc.RawTx.decode(hexToBytes(tx));
}

function getAddressFromWshOutScript(script: Uint8Array) {
  return btc.programToWitness(0, script.slice(2));
}

function getAddressFromWpkhOutScript(script: Uint8Array) {
  return btc.programToWitness(0, script.slice(2));
}

function getAddressFromTrOutScript(script: Uint8Array) {
  return btc.programToWitness(1, script.slice(2));
}

export function getAddressFromOutScript(script: Uint8Array) {
  const outScript = btc.OutScript.decode(script);

  if (outScript.type === 'wsh') return getAddressFromWshOutScript(script);
  if (outScript.type === 'wpkh') return getAddressFromWpkhOutScript(script);
  if (outScript.type === 'tr') return getAddressFromTrOutScript(script);
  return '';
}
