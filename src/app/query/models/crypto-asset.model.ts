import type {
  BaseCryptoAssetInfo,
  Blockchains,
  Brc20CryptoAssetInfo,
  BtcCryptoAssetBalance,
  BtcCryptoAssetInfo,
  CryptoAssetBalance,
  CryptoAssetType,
  MarketData,
  Sip10CryptoAssetInfo,
  StxCryptoAssetBalance,
  StxCryptoAssetInfo,
} from '@leather-wallet/models';

interface AccountCryptoAssetDetails {
  balance: CryptoAssetBalance;
  chain: Blockchains;
  info: BaseCryptoAssetInfo;
  marketData: MarketData | null;
  type: CryptoAssetType;
}

export function createAccountCryptoAssetWithDetailsFactory<T extends AccountCryptoAssetDetails>(
  args: T
): T {
  const { balance, chain, info, marketData, type } = args;
  return {
    balance,
    chain,
    info,
    marketData,
    type,
  } as T;
}

export interface BtcAccountCryptoAssetWithDetails extends AccountCryptoAssetDetails {
  balance: BtcCryptoAssetBalance;
  info: BtcCryptoAssetInfo;
}

export interface StxAccountCryptoAssetWithDetails extends AccountCryptoAssetDetails {
  balance: StxCryptoAssetBalance;
  info: StxCryptoAssetInfo;
}

export interface Brc20AccountCryptoAssetWithDetails extends AccountCryptoAssetDetails {
  holderAddress: string;
  info: Brc20CryptoAssetInfo;
}

export interface Sip10AccountCryptoAssetWithDetails extends AccountCryptoAssetDetails {
  info: Sip10CryptoAssetInfo;
}

export type AccountCryptoAssetWithDetails =
  | BtcAccountCryptoAssetWithDetails
  | StxAccountCryptoAssetWithDetails
  | Brc20AccountCryptoAssetWithDetails
  | Sip10AccountCryptoAssetWithDetails;
