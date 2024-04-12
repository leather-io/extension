import type { MarketData } from './market.model';

export interface BitcoinCryptoCurrencyAsset {
  decimals: number;
  hasMemo: boolean;
  name: string;
  symbol: 'BTC';
}

export interface StacksCryptoCurrencyAsset {
  decimals: number;
  hasMemo: boolean;
  name: string;
  symbol: 'STX';
}

export interface StacksFungibleTokenAsset {
  canTransfer: boolean;
  contractId: string;
  contractAddress: string;
  contractAssetName: string;
  contractName: string;
  decimals: number;
  hasMemo: boolean;
  imageCanonicalUri: string;
  name: string;
  marketData: MarketData | null;
  symbol: string;
}

export interface StacksNonFungibleTokenAsset {
  contractAddress: string;
  contractAssetName: string;
  contractName: string;
  imageCanonicalUri: string;
  name: string;
}
