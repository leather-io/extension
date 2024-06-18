import { styled } from 'leather-styles/jsx';

import type { StxCryptoAssetBalance } from '@leather-wallet/models';
import { useCryptoCurrencyMarketDataMeanAverage } from '@leather-wallet/query';
import { Caption, StxAvatarIcon } from '@leather-wallet/ui';
import {
  baseCurrencyAmountInQuote,
  formatMoneyWithoutSymbol,
  i18nFormatCurrency,
} from '@leather-wallet/utils';

import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';

interface StxCryptoAssetItemProps {
  balance: StxCryptoAssetBalance;
  isLoading: boolean;
  onSelectAsset?(symbol: string): void;
}
export function StxCryptoAssetItem({ balance, isLoading, onSelectAsset }: StxCryptoAssetItemProps) {
  const marketData = useCryptoCurrencyMarketDataMeanAverage('STX');

  const { availableBalance, lockedBalance } = balance;
  const showLockedBalance = lockedBalance.amount.isGreaterThan(0);

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

  return (
    <CryptoAssetItemLayout
      availableBalance={balance.availableBalance}
      captionLeft="STX"
      captionRightBulletInfo={showLockedBalance && captionRightBulletInfo}
      fiatBalance={fiatAvailableBalance}
      icon={<StxAvatarIcon />}
      isLoading={isLoading}
      onSelectAsset={onSelectAsset}
      titleLeft="Stacks"
      titleRightBulletInfo={showLockedBalance && titleRightBulletInfo}
    />
  );
}
