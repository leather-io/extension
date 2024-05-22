import type { FtMetadataResponse } from '@hirosystems/token-metadata-api-client';

import { isTransferableSip10Token } from './sip10-tokens.utils';

describe(isTransferableSip10Token.name, () => {
  test('assets with a name, symbol and decimals are allowed to be transferred', () => {
    const asset: Partial<FtMetadataResponse> = {
      decimals: 9,
      name: 'SteLLa the Cat',
      symbol: 'CAT',
    };
    expect(isTransferableSip10Token(asset)).toBeTruthy();
  });

  test('a token with no decimals is transferable', () => {
    const asset: Partial<FtMetadataResponse> = {
      decimals: 0,
      name: 'SteLLa the Cat',
      symbol: 'CAT',
    };
    expect(isTransferableSip10Token(asset)).toBeTruthy();
  });

  test('assets missing either name, symbol or decimals may not be transferred', () => {
    const asset: Partial<FtMetadataResponse> = {
      name: 'Test token',
      symbol: 'TEST',
      decimals: undefined,
    };
    expect(isTransferableSip10Token(asset)).toBeFalsy();
  });
});
