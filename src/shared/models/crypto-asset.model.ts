export interface BitcoinCryptoCurrencyAsset {
  blockchain: 'bitcoin';
  decimals: number;
  hasMemo: boolean;
  name: string;
  symbol: string;
  type: 'crypto-currency';
}

export interface StacksCryptoCurrencyAsset {
  blockchain: 'stacks';
  decimals: number;
  hasMemo: boolean;
  name: string;
  symbol: string;
  type: 'crypto-currency';
}

export interface StacksFungibleTokenAsset {
  blockchain: 'stacks';
  canTransfer: boolean;
  contractAddress: string;
  contractAssetName: string;
  contractName: string;
  decimals: number;
  hasMemo: boolean;
  imageCanonicalUri: string;
  name: string;
  symbol: string;
  type: 'fungible-token';
}

export interface StacksNonFungibleTokenAsset {
  blockchain: 'stacks';
  contractAddress: string;
  contractAssetName: string;
  contractName: string;
  imageCanonicalUri: string;
  name: string;
  type: 'non-fungible-token';
}
