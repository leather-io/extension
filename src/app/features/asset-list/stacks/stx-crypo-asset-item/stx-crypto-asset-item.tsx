import { styled } from 'leather-styles/jsx';

import type { StxCryptoAssetBalance } from '@leather.io/models';
import { useCryptoCurrencyMarketDataMeanAverage } from '@leather.io/query';
import { Caption, StxAvatarIcon } from '@leather.io/ui';
import {
  baseCurrencyAmountInQuote,
  formatMoneyWithoutSymbol,
  i18nFormatCurrency,
} from '@leather.io/utils';

import { CryptoAssetItemToggleLayout } from '@app/components/crypto-asset-item/crypto-asset-item-toggle.layout';
import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';

import type { AssetRightElementVariant } from '../../asset-list';

interface StxCryptoAssetItemProps {
  balance: StxCryptoAssetBalance;
  isLoading: boolean;
  isPrivate?: boolean;
  onSelectAsset?(symbol: string): void;
  assetRightElementVariant?: AssetRightElementVariant;
}
export function StxCryptoAssetItem({
  balance,
  isLoading,
  isPrivate,
  onSelectAsset,
  assetRightElementVariant,
}: StxCryptoAssetItemProps) {
  const marketData = useCryptoCurrencyMarketDataMeanAverage('STX');

  const { availableBalance, lockedBalance } = balance;
  const showLockedBalance = lockedBalance.amount.isGreaterThan(0) && !isPrivate;

  const fiatLockedBalance = i18nFormatCurrency(
    baseCurrencyAmountInQuote(lockedBalance, marketData)
  );
  const fiatAvailableBalance = i18nFormatCurrency(
    baseCurrencyAmountInQuote(availableBalance, marketData)
  );
  const titleRightBulletInfo = (
    <styled.span>{formatMoneyWithoutSymbol(lockedBalance)} locked</styled.span>
  );
  const captionRightBulletInfo = <Caption>{fiatLockedBalance} locked</Caption>;

  const icon = <StxAvatarIcon />;
  const captionLeft = 'STX';
  const titleLeft = 'Stacks';

  if (assetRightElementVariant === 'toggle') {
    return (
      <CryptoAssetItemToggleLayout
        captionLeft={captionLeft}
        icon={icon}
        titleLeft={titleLeft}
        assetId="STX"
      />
    );
  }

  return (
    <CryptoAssetItemLayout
      availableBalance={balance.availableBalance}
      captionLeft="STX"
      captionRightBulletInfo={showLockedBalance && captionRightBulletInfo}
      fiatBalance={fiatAvailableBalance}
      icon={<StxAvatarIcon />}
      isLoading={isLoading}
      isPrivate={isPrivate}
      onSelectAsset={onSelectAsset}
      titleLeft="Stacks"
      titleRightBulletInfo={showLockedBalance && titleRightBulletInfo}
      dataTestId="STX"
    />
  );
}
