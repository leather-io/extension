import type { BaseCryptoAssetBalance, Money } from '@leather-wallet/models';

// TODO: Move to models pkg
export function createCryptoAssetBalance(balance: Money): BaseCryptoAssetBalance {
  return { availableBalance: balance };
}
