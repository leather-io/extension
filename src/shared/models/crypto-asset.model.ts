export interface BitcoinCryptoCurrencyAsset {
  decimals: number;
  hasMemo: boolean;
  name: string;
  symbol: string;
}

export interface StacksCryptoCurrencyAsset {
  decimals: number;
  hasMemo: boolean;
  name: string;
  symbol: string;
}

export interface StacksFungibleTokenAsset {
  canTransfer: boolean;
  contractAddress: string;
  contractAssetName: string;
  contractName: string;
  decimals: number;
  hasMemo: boolean;
  imageCanonicalUri: string;
  name: string;
  symbol: string;
}

export interface StacksNonFungibleTokenAsset {
  contractAddress: string;
  contractAssetName: string;
  contractName: string;
  imageCanonicalUri: string;
  name: string;
}
