import type BigNumber from 'bignumber.js';

export interface Asset {
  name: string;
  contractAddress: string;
  contractName: string;
  subtitle: string;
  type: 'stx' | 'nft' | 'ft';
  balance: BigNumber;
  canTransfer?: boolean;
  hasMemo?: boolean;
  subBalance?: BigNumber;
}

export interface FtMeta {
  name: string;
  symbol: string;
  decimals: number;
  image_uri?: string;
  image_canonical_uri?: string;
}

export interface NftMeta {
  count: string;
  subCount?: string;
  key?: string;
  total_sent: string;
  total_received: string;
}

export type AssetWithMeta = Asset & { meta?: FtMeta };
