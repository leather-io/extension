import { styled } from 'leather-styles/jsx';

import { useStxBalance } from '@app/common/hooks/balance/stx/use-stx-balance';
import { ftDecimals } from '@app/common/stacks-utils';
import { CaptionSeparatorDot } from '@app/components/caption-dot-separator';
import { CryptoCurrencyAssetItem } from '@app/components/crypto-assets/crypto-currency-asset/crypto-currency-asset-item';
import { StxAvatar } from '@app/components/crypto-assets/stacks/components/stx-avatar';
import { useStacksFungibleTokenAssetBalancesAnchoredWithMetadata } from '@app/query/stacks/balance/stacks-ft-balances.hooks';
import { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';
import { Caption } from '@app/ui/components/typography/caption';

import { StacksFungibleTokenAssetList } from './stacks-fungible-token-asset-list';

interface StacksAssetListProps {
  account: StacksAccount;
}
export function StacksAssetList({ account }: StacksAssetListProps) {
  const stacksFtAssetBalances = useStacksFungibleTokenAssetBalancesAnchoredWithMetadata(
    account.address
  );

  const { stxEffectiveBalance, stxEffectiveUsdBalance, stxLockedBalance, stxUsdLockedBalance } =
    useStxBalance();

  const stxAdditionalBalanceInfo = stxLockedBalance?.amount.isGreaterThan(0) ? (
    <styled.span>
      <CaptionSeparatorDot mr="space.01" pos="relative" top="-2px" />
      {ftDecimals(stxLockedBalance.amount, stxLockedBalance.decimals || 0)} locked
    </styled.span>
  ) : undefined;

  const stxAdditionalUsdBalanceInfo = stxLockedBalance?.amount.isGreaterThan(0) ? (
    <Caption ml="4px">
      <CaptionSeparatorDot mr="space.01" pos="relative" top="-1px" />
      {stxUsdLockedBalance} locked
    </Caption>
  ) : undefined;

  return (
    <>
      <CryptoCurrencyAssetItem
        assetBalance={stxEffectiveBalance}
        usdBalance={stxEffectiveUsdBalance}
        address={account.address}
        additionalBalanceInfo={stxAdditionalBalanceInfo}
        additionalUsdBalanceInfo={stxAdditionalUsdBalanceInfo}
        icon={<StxAvatar />}
      />
      <StacksFungibleTokenAssetList assetBalances={stacksFtAssetBalances} />
    </>
  );
}
