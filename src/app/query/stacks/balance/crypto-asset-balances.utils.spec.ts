import BigNumber from 'bignumber.js';

import { StacksFungibleTokenAssetBalance } from '@shared/models/crypto-asset-balance.model';
import { createMoney } from '@shared/models/money.model';

import { mergeStacksFungibleTokenAssetBalances } from './crypto-asset-balances.utils';

const anchoredAssetBalances: StacksFungibleTokenAssetBalance[] = [
  {
    balance: createMoney(new BigNumber('2469135782'), 'CAT', 9),
    asset: {
      blockchain: 'stacks',
      canTransfer: true,
      contractAddress: 'ST6G7N19FKNW24XH5JQ5P5WR1DN10QWMKQSPSTK7',
      contractAssetName: 'stella-token',
      contractName: 'stella-the-cat',
      decimals: 9,
      hasMemo: true,
      imageCanonicalUri: '',
      name: 'SteLLa the Cat',
      symbol: 'CAT',
      type: 'fungible-token',
    },
    subBalance: createMoney(new BigNumber(0), 'CAT', 9),
  },
  {
    balance: createMoney(new BigNumber('9469135782'), 'ALF', 9),
    asset: {
      blockchain: 'stacks',
      canTransfer: true,
      contractAddress: 'ST6G7N19FKNW24XH5JQ5P5WR1DN10QWMKQSPSTK8',
      contractAssetName: 'alf-token',
      contractName: 'alf-the-dog',
      decimals: 9,
      hasMemo: true,
      imageCanonicalUri: '',
      name: 'Alf the Dog',
      symbol: 'ALF',
      type: 'fungible-token',
    },
    subBalance: createMoney(new BigNumber(0), 'ALF', 9),
  },
];

const unanchoredAssetBalances: StacksFungibleTokenAssetBalance[] = [
  {
    balance: createMoney(new BigNumber('1469135782'), 'CAT', 9),
    asset: {
      blockchain: 'stacks',
      canTransfer: true,
      contractAddress: 'ST6G7N19FKNW24XH5JQ5P5WR1DN10QWMKQSPSTK7',
      contractAssetName: 'stella-token',
      contractName: 'stella-the-cat',
      decimals: 9,
      hasMemo: true,
      imageCanonicalUri: '',
      name: 'SteLLa the Cat',
      symbol: 'CAT',
      type: 'fungible-token',
    },
    subBalance: createMoney(new BigNumber(0), 'CAT', 9),
  },
  {
    balance: createMoney(new BigNumber('7000100702'), 'ALF', 9),
    asset: {
      blockchain: 'stacks',
      canTransfer: true,
      contractAddress: 'ST6G7N19FKNW24XH5JQ5P5WR1DN10QWMKQSPSTK8',
      contractAssetName: 'alf-token',
      contractName: 'alf-the-dog',
      decimals: 9,
      hasMemo: true,
      imageCanonicalUri: '',
      name: 'Alf the Dog',
      symbol: 'ALF',
      type: 'fungible-token',
    },
    subBalance: createMoney(new BigNumber(0), 'ALF', 9),
  },
];

describe(mergeStacksFungibleTokenAssetBalances.name, () => {
  test('it merges fungible token asset balances (anchored & unanchored) correctly', () => {
    const mergedAssetBalances = mergeStacksFungibleTokenAssetBalances(
      anchoredAssetBalances,
      unanchoredAssetBalances
    );

    expect(mergedAssetBalances.length).toEqual(anchoredAssetBalances.length);

    for (const assetName of ['stella-token', 'alf-token', 'boxer-token']) {
      const anchoredAssetBalance = anchoredAssetBalances.find(
        assetBalance => assetBalance.asset.name === assetName
      );
      const unanchoredAssetBalance = unanchoredAssetBalances.find(
        assetBalance => assetBalance.asset.name === assetName
      );
      const mergedAssetBalance = mergedAssetBalances.find(
        assetBalance => assetBalance.asset.name === assetName
      );
      if (!mergedAssetBalance) return;
      if (anchoredAssetBalance && unanchoredAssetBalance) {
        // If there is an asset balance in the anchored balance,
        // it should be present in the merge as balance
        expect(mergedAssetBalance.balance).toEqual(anchoredAssetBalance.balance);
        expect(mergedAssetBalance.subBalance).toEqual(unanchoredAssetBalance.balance);
      } else if (anchoredAssetBalance && !unanchoredAssetBalance) {
        expect(mergedAssetBalance.balance).toEqual(anchoredAssetBalance.balance);
        expect(mergedAssetBalance?.subBalance?.amount.toFixed()).toEqual(
          new BigNumber(0).toFixed()
        );
        expect(BigNumber.isBigNumber(mergedAssetBalance.subBalance)).toBeTruthy();
      } else if (!anchoredAssetBalance && unanchoredAssetBalance) {
        expect(mergedAssetBalance.balance.amount.toFixed()).toEqual(new BigNumber(0).toFixed());
        expect(BigNumber.isBigNumber(mergedAssetBalance.balance)).toBeTruthy();
        // If there is an asset balance in the unanchored balance,
        // it should be present in the merge as subBalance
        expect(mergedAssetBalance.subBalance).toEqual(unanchoredAssetBalance.balance);
      }
    }
  });
});
