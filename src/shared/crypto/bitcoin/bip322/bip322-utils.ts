// Compatible package that isn't tiny-secp256k1
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ecc from '@bitcoinerlab/secp256k1';
import { PaymentTypes } from '@btckit/types';
import { isString } from '@leather-wallet/utils';
import { sha256 } from '@noble/hashes/sha256';
import { hexToBytes, utf8ToBytes } from '@stacks/common';
import * as bitcoin from 'bitcoinjs-lib';
import ECPairFactory from 'ecpair';
import { encode } from 'varuint-bitcoin';

import { toXOnly } from '../bitcoin.utils';

const bip322MessageTag = 'BIP0322-signed-message';

const ECPair = ECPairFactory(ecc);
bitcoin.initEccLib(ecc);

export function ecPairFromPrivateKey(key: Uint8Array) {
  return ECPair.fromPrivateKey(Buffer.from(key));
}

// See tagged hashes section of BIP-340
// https://github.com/bitcoin/bips/blob/master/bip-0340.mediawiki#design
const messageTagHash = Uint8Array.from([
  ...sha256(utf8ToBytes(bip322MessageTag)),
  ...sha256(utf8ToBytes(bip322MessageTag)),
]);

export function hashBip322Message(message: Uint8Array | string) {
  return sha256(
    Uint8Array.from([...messageTagHash, ...(isString(message) ? utf8ToBytes(message) : message)])
  );
}

export const bip322TransactionToSignValues = {
  prevoutHash: hexToBytes('0000000000000000000000000000000000000000000000000000000000000000'),
  prevoutIndex: 0xffffffff,
  sequence: 0,
};

function encodeVarString(b: Buffer) {
  return Buffer.concat([encode(b.byteLength), b]);
}

const supportedMessageSigningPaymentTypes: PaymentTypes[] = ['p2wpkh', 'p2tr'];

export function isSupportedMessageSigningPaymentType(paymentType: string) {
  return supportedMessageSigningPaymentTypes.includes(paymentType as PaymentTypes);
}

/**
 * Encode witness data for a BIP322 message
 * TODO: Refactor to remove `Buffer` use
 */
export function encodeMessageWitnessData(witnessArray: Buffer[]) {
  const len = encode(witnessArray.length);
  return Buffer.concat([len, ...witnessArray.map(witness => encodeVarString(witness))]);
}

function tapTweakHash(pubKey: Buffer, h: Buffer | undefined): Buffer {
  return bitcoin.crypto.taggedHash('TapTweak', Buffer.concat(h ? [pubKey, h] : [pubKey]));
}

export function tweakSigner(signer: bitcoin.Signer, opts: any = {}): bitcoin.Signer {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let privateKey: Uint8Array | undefined = signer.privateKey!;
  if (!privateKey) {
    throw new Error('Private key is required for tweaking signer!');
  }
  if (signer.publicKey[0] === 3) {
    privateKey = ecc.privateNegate(privateKey);
  }

  const tweakedPrivateKey = ecc.privateAdd(
    privateKey,
    tapTweakHash(toXOnly(signer.publicKey), opts.tweakHash)
  );
  if (!tweakedPrivateKey) {
    throw new Error('Invalid tweaked private key!');
  }

  return ECPair.fromPrivateKey(Buffer.from(tweakedPrivateKey), {
    network: opts.network,
  });
}
