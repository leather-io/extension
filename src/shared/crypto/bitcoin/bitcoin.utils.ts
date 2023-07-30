import { PaymentTypes } from '@btckit/types';
import { hexToBytes } from '@noble/hashes/utils';
import { HDKey, Versions } from '@scure/bip32';
import * as btc from '@scure/btc-signer';

import { BitcoinNetworkModes, NetworkModes } from '@shared/constants';
import { whenNetwork } from '@shared/utils';

import { DerivationPathDepth } from '../derivation-path.utils';
import { BtcSignerNetwork } from './bitcoin.network';

export interface BitcoinAccount {
  type: PaymentTypes;
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

// Basically same as above, to remove
export const toXOnly = (pubKey: Buffer) => (pubKey.length === 32 ? pubKey : pubKey.subarray(1, 33));

export function decodeBitcoinTx(tx: string) {
  return btc.RawTx.decode(hexToBytes(tx));
}

export function getAddressFromOutScript(script: Uint8Array, bitcoinNetwork: BtcSignerNetwork) {
  const outputScript = btc.OutScript.decode(script);

  if (outputScript.type === 'pk' || outputScript.type === 'tr') {
    return btc.Address(bitcoinNetwork).encode({
      type: outputScript.type,
      pubkey: outputScript.pubkey,
    });
  }
  if (outputScript.type === 'ms' || outputScript.type === 'tr_ms') {
    return btc.Address(bitcoinNetwork).encode({
      type: outputScript.type,
      pubkeys: outputScript.pubkeys,
      m: outputScript.m,
    });
  }
  if (outputScript.type === 'tr_ns') {
    return btc.Address(bitcoinNetwork).encode({
      type: outputScript.type,
      pubkeys: outputScript.pubkeys,
    });
  }
  if (outputScript.type === 'unknown') {
    return btc.Address(bitcoinNetwork).encode({
      type: outputScript.type,
      script,
    });
  }
  return btc.Address(bitcoinNetwork).encode({
    type: outputScript.type,
    hash: outputScript.hash,
  });
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

function inferPaymentTypeFromPath(path: string): PaymentTypes {
  if (path.startsWith('m/84')) return 'p2wpkh';
  if (path.startsWith('m/86')) return 'p2tr';
  if (path.startsWith('m/44')) return 'p2pkh';
  throw new Error(`Unable to infer payment type from path=${path}`);
}

function inferNetworkFromPath(path: string): NetworkModes {
  return path.split('/')[2].startsWith('0') ? 'mainnet' : 'testnet';
}

function extractSectionFromDerivationPath(depth: DerivationPathDepth) {
  return (path: string) => {
    const segments = path.split('/');
    const accountNum = parseInt(segments[depth].replaceAll("'", ''), 10);
    if (isNaN(accountNum)) throw new Error(`Cannot parse ${DerivationPathDepth[depth]} from path`);
    return accountNum;
  };
}

export const extractAccountIndexFromPath = extractSectionFromDerivationPath(
  DerivationPathDepth.Account
);

export const extractAddressIndexFromPath = extractSectionFromDerivationPath(
  DerivationPathDepth.AddressIndex
);

function extractExtendedPublicKeyFromPolicy(policy: string) {
  return policy.split(']')[1];
}

export function createWalletIdDecoratedPath(policy: string, walletId: string) {
  return policy.split(']')[0].replace('[', '').replace('m', walletId);
}

// Primarily used to get the correct `Version` when passing Ledger Bitcoin
// extended public keys to the HDKey constructor
export function getHdKeyVersionsFromNetwork(network: NetworkModes) {
  return whenNetwork(network)({
    mainnet: undefined,
    testnet: {
      private: 0x00000000,
      public: 0x043587cf,
    } as Versions,
  });
}

// Ledger wallets are keyed by their derivation path. To reuse the look up logic
// between payment types, this factory fn accepts a fn that generates the path
export function lookUpLedgerKeysByPath(
  derivationPathFn: (network: BitcoinNetworkModes, accountIndex: number) => string
) {
  return (keyMap: Record<string, { policy: string } | undefined>, network: NetworkModes) =>
    (accountIndex: number) => {
      const path = derivationPathFn(network, accountIndex);
      // Single wallet mode, hardcoded default walletId
      const account = keyMap[path.replace('m', 'default')];
      if (!account) return;
      return initBitcoinAccount(path, account.policy);
    };
}

function initBitcoinAccount(derivationPath: string, policy: string): BitcoinAccount {
  const xpub = extractExtendedPublicKeyFromPolicy(policy);
  const network = inferNetworkFromPath(derivationPath);
  return {
    keychain: HDKey.fromExtendedKey(xpub, getHdKeyVersionsFromNetwork(network)),
    network,
    derivationPath,
    type: inferPaymentTypeFromPath(derivationPath),
    accountIndex: extractAccountIndexFromPath(derivationPath),
  };
}
