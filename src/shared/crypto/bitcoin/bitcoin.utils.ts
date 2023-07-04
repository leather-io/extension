import { PaymentTypes } from '@btckit/types';
import { hexToBytes } from '@noble/hashes/utils';
import { HDKey } from '@scure/bip32';
import * as btc from '@scure/btc-signer';
import * as P from 'micro-packed';

import { BitcoinNetworkModes, NetworkModes } from '@shared/constants';
import { logger } from '@shared/logger';

import { DerivationPathDepth } from '../derivation-path.utils';
import { BtcSignerNetwork, getBtcSignerLibNetworkConfigByMode } from './bitcoin.network';

export interface BitcoinAccount {
  derivationPath: string;
  keychain: HDKey;
  accountIndex: number;
  network: BitcoinNetworkModes;
}

const bitcoinNetworkToCoreNetworkMap: Record<BitcoinNetworkModes, NetworkModes> = {
  mainnet: 'mainnet',
  testnet: 'testnet',
  regtest: 'testnet',
  signet: 'testnet',
};
export function bitcoinNetworkModeToCoreNetworkMode(mode: BitcoinNetworkModes) {
  return bitcoinNetworkToCoreNetworkMap[mode];
}

const coinTypeMap: Record<NetworkModes, 0 | 1> = {
  mainnet: 0,
  testnet: 1,
};

export function getBitcoinCoinTypeIndexByNetwork(network: BitcoinNetworkModes) {
  return coinTypeMap[bitcoinNetworkModeToCoreNetworkMode(network)];
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

// basically same as above, to remov
export const toXOnly = (pubKey: Buffer) => (pubKey.length === 32 ? pubKey : pubKey.slice(1, 33));

export function decodeBitcoinTx(tx: string) {
  return btc.RawTx.decode(hexToBytes(tx));
}

const concat = P.concatBytes;

function formatKey(hashed: Uint8Array, prefix: number[]): string {
  return btc.base58check.encode(concat(Uint8Array.from(prefix), hashed));
}

function getAddressFromWshOutScript(script: Uint8Array, network: BtcSignerNetwork) {
  return btc.programToWitness(0, script.slice(2), network);
}

function getAddressFromWpkhOutScript(script: Uint8Array, network: BtcSignerNetwork) {
  return btc.programToWitness(0, script.slice(2), network);
}

function getAddressFromTrOutScript(script: Uint8Array, network: BtcSignerNetwork) {
  return btc.programToWitness(1, script.slice(2), network);
}

export function getAddressFromOutScript(script: Uint8Array, network: BitcoinNetworkModes) {
  const outScript = btc.OutScript.decode(script);
  // This appears to be undefined at times?
  const bitcoinNetwork = getBtcSignerLibNetworkConfigByMode(network);

  if (outScript.type === 'wsh') return getAddressFromWshOutScript(script, bitcoinNetwork);
  else if (outScript.type === 'wpkh') return getAddressFromWpkhOutScript(script, bitcoinNetwork);
  else if (outScript.type === 'tr') return getAddressFromTrOutScript(script, bitcoinNetwork);
  else if (outScript.type === 'pkh') return formatKey(script, [bitcoinNetwork?.pubKeyHash]);
  else if (outScript.type === 'sh') return formatKey(script, [bitcoinNetwork?.scriptHash]);
  logger.error(`Unknown address type=${outScript.type}`);
  return '';
}

type BtcSignerLibPaymentTypeIdentifers = 'wpkh' | 'wsh' | 'tr' | 'pkh' | 'sh';

const paymentTypeMap: Record<BtcSignerLibPaymentTypeIdentifers, PaymentTypes> = {
  wpkh: 'p2wpkh',
  wsh: 'p2wpkh-p2sh',
  tr: 'p2tr',
  pkh: 'p2pkh',
  sh: 'p2sh',
};

function btcSignerLibPaymentTypeToPaymentTypeMap(payment: BtcSignerLibPaymentTypeIdentifers) {
  return paymentTypeMap[payment];
}

function isBtcSignerLibPaymentType(payment: string): payment is BtcSignerLibPaymentTypeIdentifers {
  return payment in paymentTypeMap;
}

function parseKnownPaymentType(payment: BtcSignerLibPaymentTypeIdentifers | PaymentTypes) {
  return isBtcSignerLibPaymentType(payment)
    ? btcSignerLibPaymentTypeToPaymentTypeMap(payment)
    : payment;
}

type PaymentTypeMap<T> = Record<PaymentTypes, T>;
export function whenPaymentType(mode: PaymentTypes | BtcSignerLibPaymentTypeIdentifers) {
  return <T>(paymentMap: PaymentTypeMap<T>): T => paymentMap[parseKnownPaymentType(mode)];
}
