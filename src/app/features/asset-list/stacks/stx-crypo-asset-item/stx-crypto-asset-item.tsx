import { styled } from 'leather-styles/jsx';

import type { StxBalance } from '@leather.io/models';
import { Caption, StxAvatarIcon } from '@leather.io/ui';
import { baseCurrencyAmountInQuote } from '@leather.io/utils';

import { formatCurrency } from '@app/common/currency-formatter';
import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import { useCryptoCurrencyMarketDataMeanAverage } from '@app/query/common/market-data/market-data.hooks';

interface StxCryptoAssetItemProps {
  balance: StxBalance;
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

  const fiatLockedBalance = formatCurrency(baseCurrencyAmountInQuote(lockedBalance, marketData), {
    preset: 'shorthand-balance',
  });
  const fiatTotalBalance = formatCurrency(baseCurrencyAmountInQuote(totalBalance, marketData), {
    preset: 'shorthand-balance',
  });
  const titleRightBulletInfo = (
    <styled.span>{formatCurrency(lockedBalance, { showCurrency: false })} locked</styled.span>
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
