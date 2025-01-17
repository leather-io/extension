import { styled } from 'leather-styles/jsx';

import type { StxCryptoAssetBalance } from '@leather.io/models';
import { useCryptoCurrencyMarketDataMeanAverage } from '@leather.io/query';
import { Caption, StxAvatarIcon } from '@leather.io/ui';
import {
  baseCurrencyAmountInQuote,
  formatMoneyWithoutSymbol,
  i18nFormatCurrency,
} from '@leather.io/utils';

import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';

interface StxCryptoAssetItemProps {
  balance: StxCryptoAssetBalance;
  isLoading: boolean;
  isPrivate?: boolean;
  onSelectAsset?(symbol: string): void;
}

export function StxCryptoAssetItem({
  balance,
  isLoading,
  isPrivate,
  onSelectAsset,
}: StxCryptoAssetItemProps) {
  const marketData = useCryptoCurrencyMarketDataMeanAverage('STX');

  const { lockedBalance, totalBalance } = balance;
  const showLockedBalance = lockedBalance.amount.isGreaterThan(0) && !isPrivate;

  const fiatLockedBalance = i18nFormatCurrency(
    baseCurrencyAmountInQuote(lockedBalance, marketData)
  );
  const fiatTotalBalance = i18nFormatCurrency(baseCurrencyAmountInQuote(totalBalance, marketData));
  const titleRightBulletInfo = (
    <styled.span>{formatMoneyWithoutSymbol(lockedBalance)} locked</styled.span>
  );
  const captionRightBulletInfo = <Caption>{fiatLockedBalance} locked</Caption>;

  return (
    <CryptoAssetItemLayout
      availableBalance={totalBalance}
      captionLeft="STX"
      captionRightBulletInfo={showLockedBalance && captionRightBulletInfo}
      fiatBalance={fiatTotalBalance}
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
