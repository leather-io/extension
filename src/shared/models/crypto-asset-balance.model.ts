import BigNumber from 'bignumber.js';

import {
  BitcoinCryptoCurrencyAsset,
  StacksCryptoCurrencyAsset,
  StacksFungibleTokenAsset,
  StacksNonFungibleTokenAsset,
} from './crypto-asset.model';
import { Money } from './money.model';

export interface BitcoinCryptoCurrencyAssetBalance {
  readonly blockchain: 'bitcoin';
  asset: BitcoinCryptoCurrencyAsset;
  balance: Money;
  readonly type: 'crypto-currency';
}

export interface StacksCryptoCurrencyAssetBalance {
  readonly blockchain: 'stacks';
  asset: StacksCryptoCurrencyAsset;
  balance: Money;
  subBalance: Money;
  readonly type: 'crypto-currency';
}

export interface StacksFungibleTokenAssetBalance {
  readonly blockchain: 'stacks';
  asset: StacksFungibleTokenAsset;
  balance: Money;
  subBalance: Money;
  readonly type: 'fungible-token';
}

export interface StacksNonFungibleTokenAssetBalance {
  readonly blockchain: 'stacks';
  asset: StacksNonFungibleTokenAsset;
  count: BigNumber;
  readonly type: 'non-fungible-token';
}

export type AllCryptoCurrencyAssetBalances =
  | BitcoinCryptoCurrencyAssetBalance
  | StacksCryptoCurrencyAssetBalance;

export type AllTransferableCryptoAssetBalances =
  | AllCryptoCurrencyAssetBalances
  | StacksFungibleTokenAssetBalance;
