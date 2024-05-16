import type {
  Brc20CryptoAssetInfo,
  BtcCryptoAssetInfo,
  CryptoAssetBalance,
  Money,
  RuneCryptoAssetInfo,
  Sip10CryptoAssetInfo,
  Src20CryptoAssetInfo,
  Stx20CryptoAssetInfo,
  StxCryptoAssetInfo,
} from '@leather-wallet/models';

// TODO: Move to the models pkg
export type CryptoAssetInfo =
  | BtcCryptoAssetInfo
  | StxCryptoAssetInfo
  | Brc20CryptoAssetInfo
  | RuneCryptoAssetInfo
  | Src20CryptoAssetInfo
  | Sip10CryptoAssetInfo
  | Stx20CryptoAssetInfo;

export function createCryptoAssetBalance(balance: Money): CryptoAssetBalance {
  return { availableBalance: balance };
}
