import type { SwapAsset } from "@leather.io/query";
import { filterTokens, isTokenEnabled, sortTokensBySwappability } from "./filter-tokens";

describe('filterTokens', () => {
  const mockTokens = [
    { id: 'token1' },
    { id: 'token2' },
    { id: 'token3' }
  ];
  const mockAllTokens = [
    { id: 'token1', accountIndex: 0, enabled: true },
    { id: 'token2', accountIndex: 0, enabled: false },
    { id: 'token3', accountIndex: 0, enabled: true }
  ];
  const getTokenIdentifier = (token: { id: string }) => token.id;

  test('returns all tokens when filter is "all"', () => {
    const result = filterTokens({
      tokens: mockTokens,
      accountIndex: 0,
      allTokens: mockAllTokens,
      filter: 'all',
      getTokenIdentifier
    });
    expect(result).toEqual(mockTokens);
  });

  test('returns enabled tokens when filter is "enabled"', () => {
    const result = filterTokens({
      tokens: mockTokens,
      accountIndex: 0,
      allTokens: mockAllTokens,
      filter: 'enabled',
      getTokenIdentifier
    });
    expect(result).toEqual([{ id: 'token1' }, { id: 'token3' }]);
  });

  test('returns disabled tokens when filter is "disabled"', () => {
    const result = filterTokens({
      tokens: mockTokens,
      accountIndex: 0,
      allTokens: mockAllTokens,
      filter: 'disabled',
      getTokenIdentifier
    });
    expect(result).toEqual([{ id: 'token2' }]);
  });

  test('throws error when getTokenIdentifier is missing', () => {
    expect(() => {
      filterTokens({
        tokens: mockTokens,
        accountIndex: 0,
        allTokens: mockAllTokens,
        filter: 'enabled',
        getTokenIdentifier: undefined as any
      });
    }).toThrow('Token identifier is missing');
  });
});

describe('isTokenEnabled', () => {
  const mockAllTokens = [
    { id: 'token1', accountIndex: 0, enabled: true },
    { id: 'token2', accountIndex: 0, enabled: false },
    { id: 'token3', accountIndex: 1, enabled: true }
  ];

  test('returns true for enabled token', () => {
    const result = isTokenEnabled({
      allTokens: mockAllTokens,
      accountIndex: 0,
      tokenIdentifier: 'token1'
    });
    expect(result).toBe(true);
  });

  test('returns false for disabled token', () => {
    const result = isTokenEnabled({
      allTokens: mockAllTokens,
      accountIndex: 0,
      tokenIdentifier: 'token2'
    });
    expect(result).toBe(false);
  });

  test('returns true for default enabled token', () => {
    const result = isTokenEnabled({
      allTokens: mockAllTokens,
      accountIndex: 0,
      tokenIdentifier: 'bitcoin'
    });
    expect(result).toBe(true);
  });

  test('returns false for non-existent token', () => {
    const result = isTokenEnabled({
      allTokens: mockAllTokens,
      accountIndex: 0,
      tokenIdentifier: 'non-existent-token'
    });
    expect(result).toBe(false);
  });
});


describe('sortTokensBySwappability', () => {
  const mockTokens = [
    { id: 'principal1::contract' },
    { id: 'principal2::contract' },
    { id: 'principal3::contract' }
  ];
  const mockSwapAssets = [
    { principal: 'principal2' },
    { principal: 'principal3' }
  ] as SwapAsset[];
  const getTokenIdentifier = (token: { id: string }) => token.id;

  test('sorts tokens based on swappability', () => {
    const result = sortTokensBySwappability({
      tokens: mockTokens,
      swapAssets: mockSwapAssets,
      getTokenIdentifier
    });
    expect(result).toEqual([
    { id: 'principal2::contract' },
    { id: 'principal3::contract' },
    { id: 'principal1::contract' }
    ]);
  });

  test('handles empty swapAssets', () => {
    const result = sortTokensBySwappability({
      tokens: mockTokens,
      swapAssets: [],
      getTokenIdentifier
    });
    expect(result).toEqual(mockTokens);
  });
});
