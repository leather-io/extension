import { styled } from 'leather-styles/jsx';

import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { ftDecimals } from '@app/common/stacks-utils';
import { CryptoAssetItemLayout } from '@app/components/crypto-assets/crypto-asset-item/crypto-asset-item.layout';
import { stxCryptoAssetInfo } from '@app/components/crypto-assets/crypto-asset-item/crypto-asset-item.utils';
import { useCryptoCurrencyMarketDataMeanAverage } from '@app/query/common/market-data/market-data.hooks';
import { useStxCryptoAssetBalance } from '@app/query/stacks/balance/stx-balance.hooks';
import { StxAvatarIcon } from '@app/ui/components/avatar/stx-avatar-icon';
import { BulletOperator } from '@app/ui/components/bullet-separator/bullet-separator';
import { Caption } from '@app/ui/components/typography/caption';

interface StxBalanceListItemProps {
  address: string;
}
export function StxBalanceListItem({ address }: StxBalanceListItemProps) {
  const marketData = useCryptoCurrencyMarketDataMeanAverage('STX');
  const { data: stxCryptoAssetBalance, isInitialLoading } = useStxCryptoAssetBalance(address);

  if (!stxCryptoAssetBalance) return null;

  const { availableBalance, lockedBalance } = stxCryptoAssetBalance;
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
      {ftDecimals(lockedBalance.amount, lockedBalance.decimals || 0)} locked
    </styled.span>
  );
  const additionalBalanceInfoAsFiat = <Caption>{lockedBalanceAsFiat} locked</Caption>;

  return (
    <CryptoAssetItemLayout
      address={address}
      additionalBalanceInfo={showAdditionalInfo && additionalBalanceInfo}
      additionalBalanceInfoAsFiat={showAdditionalInfo && additionalBalanceInfoAsFiat}
      assetBalance={stxCryptoAssetBalance}
      balanceAsFiat={availableBalanceAsFiat}
      icon={<StxAvatarIcon />}
      isLoading={isInitialLoading}
      name={stxCryptoAssetInfo.name}
    />
  );
}
