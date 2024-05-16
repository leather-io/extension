import type { StxCryptoAssetBalance } from '@leather-wallet/models';
import { styled } from 'leather-styles/jsx';

import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { ftDecimals } from '@app/common/stacks-utils';
import { capitalize } from '@app/common/utils';
import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import { StxAvatarIcon } from '@app/ui/components/avatar/stx-avatar-icon';
import { BulletOperator } from '@app/ui/components/bullet-separator/bullet-separator';
import { Caption } from '@app/ui/components/typography/caption';

import type { AssetItem } from '../../asset-list';

interface StxAssetItem extends AssetItem {
  balance: StxCryptoAssetBalance;
}

interface StxCryptoAssetItemProps {
  token: StxAssetItem;
  isLoading: boolean;
  onClick?(symbol: string): void;
}
export function StxCryptoAssetItem({ token, isLoading, onClick }: StxCryptoAssetItemProps) {
  const { assetInfo, balance, marketData } = token;
  const { availableBalance, lockedBalance } = balance;
  const showAdditionalInfo = lockedBalance.amount.isGreaterThan(0);

  const lockedBalanceAsFiat = i18nFormatCurrency(
    baseCurrencyAmountInQuote(lockedBalance, marketData)
  );
  const availableBalanceAsFiat = i18nFormatCurrency(
    baseCurrencyAmountInQuote(availableBalance, marketData)
  );
  const additionalBalanceInfo = (
    <styled.span>
      <BulletOperator ml="space.01" mr="space.02" />
      {ftDecimals(lockedBalance.amount, lockedBalance.decimals)} locked
    </styled.span>
  );
  const additionalBalanceInfoAsFiat = <Caption>{lockedBalanceAsFiat} locked</Caption>;

  return (
    <CryptoAssetItemLayout
      additionalBalanceInfo={showAdditionalInfo && additionalBalanceInfo}
      additionalBalanceInfoAsFiat={showAdditionalInfo && additionalBalanceInfoAsFiat}
      balance={balance}
      fiatBalance={availableBalanceAsFiat}
      icon={<StxAvatarIcon />}
      isLoading={isLoading}
      name={capitalize(assetInfo.name)}
      onClick={onClick}
      symbol={assetInfo.symbol}
    />
  );
}
