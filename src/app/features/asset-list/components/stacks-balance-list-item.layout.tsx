import { styled } from 'leather-styles/jsx';

import type { StacksCryptoCurrencyAssetBalance } from '@shared/models/crypto-asset-balance.model';
import type { Money } from '@shared/models/money.model';

import { ftDecimals } from '@app/common/stacks-utils';
import { CryptoCurrencyAssetItemLayout } from '@app/components/crypto-assets/crypto-currency-asset/crypto-currency-asset-item.layout';
import { StxAvatarIcon } from '@app/ui/components/avatar/stx-avatar-icon';
import { BulletOperator } from '@app/ui/components/bullet-separator/bullet-separator';
import { Caption } from '@app/ui/components/typography/caption';

interface StacksBalanceListItemLayoutProps {
  address: string;
  stxEffectiveBalance: StacksCryptoCurrencyAssetBalance;
  stxEffectiveUsdBalance?: string;
  stxLockedBalance?: Money;
  stxUsdLockedBalance?: string;
}
export function StacksBalanceListItemLayout(props: StacksBalanceListItemLayoutProps) {
  const {
    address,
    stxEffectiveBalance,
    stxEffectiveUsdBalance,
    stxLockedBalance,
    stxUsdLockedBalance,
  } = props;

  const stxAdditionalBalanceInfo = stxLockedBalance?.amount.isGreaterThan(0) ? (
    <styled.span>
      <BulletOperator ml="space.01" mr="space.02" />
      {ftDecimals(stxLockedBalance.amount, stxLockedBalance.decimals || 0)} locked
    </styled.span>
  ) : undefined;

  const stxAdditionalUsdBalanceInfo = stxLockedBalance?.amount.isGreaterThan(0) ? (
    <Caption>{stxUsdLockedBalance} locked</Caption>
  ) : undefined;

  return (
    <CryptoCurrencyAssetItemLayout
      assetBalance={stxEffectiveBalance}
      usdBalance={stxEffectiveUsdBalance}
      address={address}
      additionalBalanceInfo={stxAdditionalBalanceInfo}
      additionalUsdBalanceInfo={stxAdditionalUsdBalanceInfo}
      icon={<StxAvatarIcon />}
    />
  );
}
