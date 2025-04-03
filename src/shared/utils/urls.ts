import { isWebUri } from 'valid-url';

export function isValidUrl(str: string) {
  return !!isWebUri(str);
}

export function getHostnameFromUrl(origin: string) {
  const url = new URL(origin);
  const hostname = url.hostname;
  if (!hostname) throw new Error('Invalid URL: ' + origin);
  if (hostname === 'localhost') return `${hostname}:${url.port}`;
  return hostname;
}
