import { ReactNode } from 'react';

import { Box, Flex, styled } from 'leather-styles/jsx';

import { spamFilter } from '@app/common/utils/spam-filter';
import type { AccountCryptoAssetWithDetails } from '@app/query/models/crypto-asset.model';
import { BulletSeparator } from '@app/ui/components/bullet-separator/bullet-separator';
import { ItemLayout } from '@app/ui/components/item-layout/item-layout';
import { SkeletonLoader } from '@app/ui/components/skeleton-loader/skeleton-loader';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';
import { Caption } from '@app/ui/components/typography/caption';
import { Pressable } from '@app/ui/pressable/pressable';

import { parseCryptoAssetBalance } from './crypto-asset-item.layout.utils';

interface CryptoAssetItemLayoutProps {
  additionalBalanceInfo?: ReactNode;
  additionalBalanceInfoAsFiat?: ReactNode;
  asset: AccountCryptoAssetWithDetails;
  caption?: string;
  fiatBalance?: string;
  icon: React.ReactNode;
  isLoading?: boolean;
  name: string;
  onClick?(asset: AccountCryptoAssetWithDetails): void;
  rightElement?: React.ReactNode;
}
export function CryptoAssetItemLayout({
  additionalBalanceInfo,
  additionalBalanceInfoAsFiat,
  asset,
  caption,
  fiatBalance,
  icon,
  isLoading = false,
  name,
  onClick,
  rightElement,
}: CryptoAssetItemLayoutProps) {
  const { dataTestId, formattedBalance } = parseCryptoAssetBalance(asset.balance);
  const { availableBalance } = asset.balance;
  const title = spamFilter(name);

  const titleRight = (
    <SkeletonLoader width="126px" isLoading={isLoading}>
      {rightElement ? (
        rightElement
      ) : (
        <BasicTooltip
          asChild
          label={formattedBalance.isAbbreviated ? availableBalance.amount.toString() : undefined}
          side="left"
        >
          <styled.span data-testid={title} textStyle="label.02">
            {formattedBalance.value} {additionalBalanceInfo}
          </styled.span>
        </BasicTooltip>
      )}
    </SkeletonLoader>
  );

  const captionRight = (
    <SkeletonLoader width="78px" isLoading={isLoading}>
      {!rightElement && (
        <Caption>
          <Flex alignItems="center" gap="space.02" color="inherit">
            <BulletSeparator>
              <Caption>{availableBalance.amount.toNumber() > 0 ? fiatBalance : null}</Caption>
              {additionalBalanceInfoAsFiat}
            </BulletSeparator>
          </Flex>
        </Caption>
      )}
    </SkeletonLoader>
  );

  const isInteractive = !!onClick;

  const content = (
    <ItemLayout
      flagImg={icon}
      titleLeft={title}
      captionLeft={caption ?? availableBalance.symbol}
      titleRight={titleRight}
      captionRight={captionRight}
    />
  );

  if (isInteractive)
    return (
      <Pressable data-testid={dataTestId} onClick={() => onClick(asset)} my="space.02">
        {content}
      </Pressable>
    );

  return <Box my="space.02">{content}</Box>;
}
