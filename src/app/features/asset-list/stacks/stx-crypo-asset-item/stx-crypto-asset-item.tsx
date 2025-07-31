import { styled } from 'leather-styles/jsx';

import type { AddressQuotedStxBalance } from '@leather.io/services';
import { Caption, StxAvatarIcon } from '@leather.io/ui';

import { formatCurrency } from '@app/common/currency-formatter';
import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';

interface StxCryptoAssetItemProps {
  balance: AddressQuotedStxBalance;
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
  const { lockedBalance, totalBalance } = balance.stx;
  const showLockedBalance = lockedBalance.amount.isGreaterThan(0) && !isPrivate;

  const fiatLockedBalance = formatCurrency(balance.quote.lockedBalance);

  const fiatTotalBalance = formatCurrency(balance.quote.totalBalance);

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
