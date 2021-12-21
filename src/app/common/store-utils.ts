import { userHasAllowedDiagnosticsKey } from '@shared/utils/storage';
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

// LocalStorage keys kept across sign-in/signout sessions
const PERSISTENT_LOCAL_DATA: string[] = [userHasAllowedDiagnosticsKey];

export function clearSessionLocalData() {
  const backup = PERSISTENT_LOCAL_DATA.map((key: string) => [key, localStorage.getItem(key)]);

  localStorage.clear();

  // Store the backup in localStorage
  backup.forEach(([key, value]) => {
    if (key === null || value === null) return;
    localStorage.setItem(key, value);
  });
  return localStorage;
}
