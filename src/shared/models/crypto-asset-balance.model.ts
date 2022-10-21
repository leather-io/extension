import BigNumber from 'bignumber.js';

import {
  BitcoinCryptoCurrencyAsset,
  StacksCryptoCurrencyAsset,
  StacksFungibleTokenAsset,
  StacksNonFungibleTokenAsset,
} from './crypto-asset.model';
import { Money } from './money.model';

export interface BitcoinCryptoCurrencyAssetBalance {
  asset: BitcoinCryptoCurrencyAsset;
  balance: Money;
}

export interface StacksCryptoCurrencyAssetBalance {
  asset: StacksCryptoCurrencyAsset;
  balance: Money;
  subBalance: Money;
}

export interface StacksFungibleTokenAssetBalance {
  asset: StacksFungibleTokenAsset;
  balance: Money;
  subBalance: Money;
}

export interface StacksNonFungibleTokenAssetBalance {
  asset: StacksNonFungibleTokenAsset;
  count: BigNumber;
}
