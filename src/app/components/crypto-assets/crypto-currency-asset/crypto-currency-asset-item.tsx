import type { AllCryptoCurrencyAssetBalances } from '@shared/models/crypto-asset-balance.model';

import { spamFilter } from '@app/common/utils/spam-filter';

import { CryptoCurrencyAssetItemLayout } from './crypto-currency-asset-item.layout';

interface CryptoCurrencyAssetItemProps {
  assetBalance: AllCryptoCurrencyAssetBalances;
  icon: React.ReactNode;
  usdBalance?: string;
  address?: string;
  isPressable?: boolean;
  additionalBalanceInfo?: React.ReactNode;
  additionalUsdBalanceInfo?: React.ReactNode;
  rightElement?: React.ReactNode;
  onClick?(): void;
}
export function CryptoCurrencyAssetItem({
  additionalBalanceInfo,
  additionalUsdBalanceInfo,
  address,
  assetBalance,
  icon,
  isPressable,
  onClick,
  rightElement,
  usdBalance,
}: CryptoCurrencyAssetItemProps) {
  const { balance, asset } = assetBalance;

  return (
    <CryptoCurrencyAssetItemLayout
      balance={balance}
      caption={assetBalance.balance.symbol}
      icon={icon}
      isPressable={isPressable}
      title={spamFilter(asset.name)}
      address={address}
      usdBalance={usdBalance}
      onClick={onClick}
      additionalBalanceInfo={additionalBalanceInfo}
      additionalUsdBalanceInfo={additionalUsdBalanceInfo}
      rightElement={rightElement}
    />
  );
}
