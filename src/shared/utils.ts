import { NetworkModes } from './constants';
import { logger } from './logger';

export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isBigInt(value: unknown): value is bigint {
  return typeof value === 'bigint';
}

export function isUndefined(value: unknown): value is undefined {
  return typeof value === 'undefined';
}

export function isFunction(value: unknown): value is () => void {
  return typeof value === 'function';
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function isObject(value: unknown): value is object {
  return typeof value === 'object';
}

export function isEmpty(value: object) {
  return Object.keys(value).length === 0;
}

export function isDefined<T>(argument: T | undefined): argument is T {
  return !isUndefined(argument);
}

export function isTypedArray(val: unknown): val is Uint8Array {
  const TypedArray = Object.getPrototypeOf(Uint8Array);
  return val instanceof TypedArray;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop() {}

export function ensureArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export function undefinedIfLengthZero<T extends any[]>(arr: T) {
  return arr.length ? arr : undefined;
}

type NetworkMap<T> = Record<NetworkModes, T>;

export function whenNetwork(mode: NetworkModes) {
  return <T extends NetworkMap<unknown>>(networkMap: T) => networkMap[mode] as T[NetworkModes];
}

export function isEmptyArray(data: unknown[]) {
  return data.length === 0;
}

export const defaultWalletKeyId = 'default' as const;

export function closeWindow() {
  if (process.env.DEBUG_PREVENT_WINDOW_CLOSE === 'true') {
    logger.warn('Prevented window close with flag DEBUG_PREVENT_WINDOW_CLOSE');
    return;
  }
  // We prevent `window.close()` directly as to allow for debugging helper
  // eslint-disable-next-line no-restricted-properties
  window.close();
}

export function reverseBytes(bytes: Buffer): Buffer;
export function reverseBytes(bytes: Uint8Array): Uint8Array;
export function reverseBytes(bytes: Buffer | Uint8Array) {
  if (Buffer.isBuffer(bytes)) return Buffer.from(bytes).reverse();
  return new Uint8Array(bytes.slice().reverse());
}

export function makeNumberRange(num: number) {
  return [...Array(num).keys()];
}
