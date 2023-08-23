import { utf8ToBytes } from 'micro-stacks/common';
import { hashSha256 } from 'micro-stacks/crypto-sha';

export type BufferType = Buffer | Uint8Array;

export function reverseBuffer(buffer: BufferType): Uint8Array {
  if (buffer.length < 1) return buffer;

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
  const uintOutput = Uint8Array.from(output);
  const hash = hashSha256(uintOutput);
  const reversed = reverseBuffer(Buffer.from(hash));

  return reversed;
}

export function hexPadded(hex: string) {
  return hex.length % 2 ? `0${hex}` : hex;
}

export function secretToHash(secret: string) {
  const bytes = utf8ToBytes(secret);
  return hashSha256(bytes);
}
