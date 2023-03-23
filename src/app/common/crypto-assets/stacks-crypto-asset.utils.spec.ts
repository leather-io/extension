import { StacksFungibleTokenAsset } from '@shared/models/crypto-asset.model';

import {
  isFtNameLikeStx,
  isTransferableStacksFungibleTokenAsset,
} from './stacks-crypto-asset.utils';

describe(isFtNameLikeStx.name, () => {
  it('detect impersonating token names', () => {
    expect(isFtNameLikeStx('STX')).toBeTruthy();
    expect(isFtNameLikeStx('stx')).toBeTruthy();
    expect(isFtNameLikeStx('stacks')).toBeTruthy();
    expect(isFtNameLikeStx('Stäcks')).toBeTruthy();
    expect(isFtNameLikeStx('Stácks')).toBeTruthy();
    expect(isFtNameLikeStx('Stáçks')).toBeTruthy();
    expect(isFtNameLikeStx('stocks')).toBeFalsy();
    expect(isFtNameLikeStx('miamicoin')).toBeFalsy();
    expect(isFtNameLikeStx('')).toBeFalsy();
  });
});

describe(isTransferableStacksFungibleTokenAsset.name, () => {
  test('assets with a name, symbol and decimals are allowed to be transferred', () => {
    const asset: StacksFungibleTokenAsset = {
      contractId: '',
      contractAddress: 'ST6G7N19FKNW24XH5JQ5P5WR1DN10QWMKQSPSTK7',
      contractAssetName: 'stella-token',
      contractName: 'stella-the-cat',
      decimals: 9,
      name: 'SteLLa the Cat',
      canTransfer: true,
      hasMemo: true,
      imageCanonicalUri: '',
      symbol: 'CAT',
    };
    expect(isTransferableStacksFungibleTokenAsset(asset)).toBeTruthy();
  });

  test('a token with no decimals is transferable', () => {
    const asset: StacksFungibleTokenAsset = {
      contractId: '',
      contractAddress: 'ST6G7N19FKNW24XH5JQ5P5WR1DN10QWMKQSPSTK7',
      contractAssetName: 'stella-token',
      contractName: 'stella-the-cat',
      decimals: 0,
      name: 'SteLLa the Cat',
      canTransfer: true,
      hasMemo: true,
      imageCanonicalUri: '',
      symbol: 'CAT',
    };
    expect(isTransferableStacksFungibleTokenAsset(asset)).toBeTruthy();
  });

  test('assets missing either name, symbol or decimals may not be transferred', () => {
    const asset = {
      name: 'Test token',
      symbol: 'TEST',
      decimals: undefined,
      type: 'fungible-token',
    } as unknown as StacksFungibleTokenAsset;
    expect(isTransferableStacksFungibleTokenAsset(asset)).toBeFalsy();
  });

  test('NFTs cannot be sent', () => {
    const asset = { type: 'non-fungible-token' } as unknown as StacksFungibleTokenAsset;

    expect(isTransferableStacksFungibleTokenAsset(asset)).toBeFalsy();
  });
});
