import { extractAccountIndexFromPath, extractAddressIndexFromPath } from './bitcoin.utils';

describe(extractAddressIndexFromPath.name, () => {
  test('should extract the address index from a derivation path', () => {
    expect(extractAddressIndexFromPath("m/84'/0'/0'/0/0")).toEqual(0);
    expect(extractAddressIndexFromPath("m/84'/0'/0'/0/10")).toEqual(10);
    expect(extractAddressIndexFromPath("m/84'/0'/0'/0/9999")).toEqual(9999);
  });
});

describe(extractAccountIndexFromPath.name, () => {
  test('should extract the account index from a derivation path', () => {
    expect(extractAccountIndexFromPath("m/84'/0'/0'/0/0")).toEqual(0);
    expect(extractAccountIndexFromPath("m/84'/0'/10'/0/0")).toEqual(10);
    expect(extractAccountIndexFromPath("m/84'/0'/9999'/0/0")).toEqual(9999);
  });
});
