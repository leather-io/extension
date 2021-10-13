import hash from 'object-hash';
import { hashQueryKey, QueryKey } from 'react-query';

export function textToBytes(content: string) {
  return new TextEncoder().encode(content);
}

export function bytesToText(buffer: Uint8Array) {
  return new TextDecoder().decode(buffer);
}

export function makeLocalDataKey(params: QueryKey): string {
  return hash(hashQueryKey([params, VERSION]));
}

export function getLocalData<Data>(params: string[]) {
  const key = makeLocalDataKey(params);
  const value = localStorage.getItem(key);
  if (!value) return null;
  return JSON.parse(value) as Data;
}

export function setLocalData<Data>(params: string[], data: Data): Data {
  const key = makeLocalDataKey(params);
  localStorage.setItem(key, JSON.stringify(data));
  return data;
}
