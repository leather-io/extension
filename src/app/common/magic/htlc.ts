import { payments, script } from 'bitcoinjs-lib';
import type { networks as BitcoinNetworks } from 'bitcoinjs-lib';
import { IntegerType, bytesToHex, hexToBytes, intToHex, utf8ToBytes } from '@stacks/common'
import { sha256 } from '@noble/hashes/sha256';

export interface HTLC {
  hash: Uint8Array;
  senderPublicKey: Uint8Array;
  recipientPublicKey: Uint8Array;
  expiration?: number;
  swapper: IntegerType;
}

export type BufferType = Buffer | Uint8Array;

export function numberToLE(num: IntegerType, length = 4) {
  const hexBE = intToHex(num, length);
  let le = '';

  for (let i = 0; i < length; i++) {
    le += hexBE.slice(-2 * (i + 1), -2 * i || length * 2);
  }

  return le;
}

export function numberToLEBytes(num: IntegerType, length = 4) {
  return hexToBytes(numberToLE(num, length));
}

export const CSV_DELAY = 500;
export const CSV_DELAY_BUFF = script.number.encode(CSV_DELAY);
export const CSV_DELAY_HEX = CSV_DELAY_BUFF.toString('hex');

export function encodeExpiration(expiration?: number): Buffer {
  return typeof expiration === 'undefined' ? CSV_DELAY_BUFF : script.number.encode(expiration);
}

export function htlcASM({ hash, senderPublicKey, recipientPublicKey, expiration, swapper }: HTLC) {
  const swapperHex = numberToLE(swapper);

  return `
  ${swapperHex} OP_DROP
	OP_IF
    OP_SHA256 ${bytesToHex(hash)}
    OP_EQUALVERIFY
		${bytesToHex(recipientPublicKey)}
	OP_ELSE
		${encodeExpiration(expiration).toString('hex')}
		OP_CHECKSEQUENCEVERIFY
		OP_DROP
		${bytesToHex(senderPublicKey)}
	OP_ENDIF
	OP_CHECKSIG`
    .replace(/\s+/g, ' ')
    .trim();
}

export function generateHTLCScript(htlc: HTLC) {
  const asm = htlcASM(htlc);
  const output = script.fromASM(asm);
  return output;
}

export function generateHTLCAddress(htlc: HTLC, network: BitcoinNetworks.Network) {
  const script = generateHTLCScript(htlc);
  const payment = payments.p2sh({ redeem: { output: script, network }, network });

  return payment;
}

export function reverseBuffer(buffer: BufferType): Uint8Array {
  if (buffer.length < 1) {
    return buffer;
  }

  let j = buffer.length - 1;
  let tmp = 0;

  for (let i = 0; i < buffer.length / 2; i++) {
    tmp = buffer[i];
    buffer[i] = buffer[j];
    buffer[j] = tmp;
    j--;
  }

  return Uint8Array.from(buffer);
}

export function getScriptHash(output: BufferType): Uint8Array {
  const parsedOutput = Uint8Array.from(output);
  const hashedOutput = sha256(parsedOutput);
  const reversedOutput = reverseBuffer(Buffer.from(hashedOutput));

  return reversedOutput;
}

export function hexPadded(hex: string) {
  const bytes = hex.length % 2 ? `0${hex}` : hex;
  return bytes;
}

export function secretToHash(secret: string) {
  const bytes = utf8ToBytes(secret);
  return sha256(bytes);
}
