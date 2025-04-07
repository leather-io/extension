// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import bigListOfNaughtyStrings from 'blns';

import { getHostnameFromUrl, isValidUrl } from './urls';

describe('isValidUrl', () => {
  test('accepts normal URLs', () => {
    const normal = [
      'http://example.com',
      'https://blockstack.com/asdf?hey=true',
      'https://blockstack.org/asdf#anchor',
    ];

    normal.forEach(url => {
      expect(isValidUrl(url)).toEqual(true);
    });
  });

  test('rejects non http(s) schemas', () => {
    // one of the strings is a actual url
    const naughtyStrings = (bigListOfNaughtyStrings as string[]).filter(
      str => !str.startsWith('http')
    );
    const bad = [
      ...naughtyStrings,
      'javascript:alert("hello")//',
      'web.org',
      'javascript:console.log();',
      'javascripT:console.log();',
      'JaVascRipt:console.log();',
    ];

    bad.forEach(url => {
      expect(isValidUrl(url)).toEqual(false);
    });
  });
});

describe('getHostnameFromUrl', () => {
  test('returns hostname for valid URLs', () => {
    const urls = [
      'http://example.com',
      'https://leather.io',
      'https://blockstack.com',
      'https://blockstack.org/asdf#anchor',
      'https://subdomain.leather.io',
    ];

    const expected = [
      'example.com',
      'leather.io',
      'blockstack.com',
      'blockstack.org',
      'subdomain.leather.io',
    ];

    urls.forEach((url, index) => expect(getHostnameFromUrl(url)).toEqual(expected[index]));
  });

  test('returns hostname with port for localhost URLs', () => {
    const localhostUrls = [
      'http://localhost:3000',
      'https://localhost:8080',
      'http://localhost:1234',
    ];

    const expected = ['localhost:3000', 'localhost:8080', 'localhost:1234'];

    localhostUrls.forEach((url, index) => {
      expect(getHostnameFromUrl(url)).toEqual(expected[index]);
    });
  });

  test('throws error for invalid URLs', () => {
    const invalidUrls = ['not-a-url', 'file:////path/name', 'http://', 'localhost:3000'];

    invalidUrls.forEach(url => {
      expect(() => getHostnameFromUrl(url)).toThrowError();
    });
  });
});
