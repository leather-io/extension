import { AssetWithMeta } from '../asset-types';
import { isTransferableAsset } from './is-transferable-asset';

describe(isTransferableAsset.name, () => {
  test('assets with a name, symbol and decimals are allowed to be transferred', () => {
    const asset = {
      type: 'ft',
      meta: {
        name: 'Test token',
        symbol: 'TEST',
        decimals: 2,
      },
    } as AssetWithMeta;
    expect(isTransferableAsset(asset)).toBeTruthy();
  });

  test('stella the cat token', () => {
    const asset = {
      type: 'ft',
      subtitle: 'ST6G7…PSTK7.stella-the-cat',
      contractAddress: 'ST6G7N19FKNW24XH5JQ5P5WR1DN10QWMKQSPSTK7',
      contractName: 'stella-the-cat',
      name: 'stella-token',
      canTransfer: true,
      meta: {
        token_uri: 'https://example.com',
        name: 'SteLLa the Cat',
        description: '',
        image_uri: '',
        image_canonical_uri: '',
        symbol: 'CAT',
        decimals: 9,
        tx_id: '0x56c6381874c8f6b152c8815d950764b8759b97660fdc50091f3c1368d7f1c514',
        sender_address: 'ST6G7N19FKNW24XH5JQ5P5WR1DN10QWMKQSPSTK7',
      },
    } as unknown as AssetWithMeta;
    expect(isTransferableAsset(asset)).toBeTruthy();
  });

  test('a token with no decimals is transferable', () => {
    const asset = {
      type: 'ft',
      meta: {
        token_uri: 'https://example.com',
        name: 'SteLLa the Cat',
        description: '',
        image_uri: '',
        image_canonical_uri: '',
        symbol: 'CAT',
        decimals: 0,
        tx_id: '0x56c6381874c8f6b152c8815d950764b8759b97660fdc50091f3c1368d7f1c514',
        sender_address: 'ST6G7N19FKNW24XH5JQ5P5WR1DN10QWMKQSPSTK7',
      },
    } as unknown as AssetWithMeta;
    expect(isTransferableAsset(asset)).toBeTruthy();
  });

  test('assets missing either name, symbol or decimals may not be transferred', () => {
    const asset = {
      type: 'ft',
      meta: {
        name: 'Test token',
        symbol: 'TEST',
        decimals: undefined,
      },
    } as unknown as AssetWithMeta;
    expect(isTransferableAsset(asset)).toBeFalsy();
  });

  test('NFTs cannot be sent', () => {
    const asset = { type: 'nft' } as unknown as AssetWithMeta;
    expect(isTransferableAsset(asset)).toBeFalsy();
  });
});
