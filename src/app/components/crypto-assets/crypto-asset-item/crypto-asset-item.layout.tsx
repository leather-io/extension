import { ReactNode } from 'react';

import type { CryptoAssetBalances } from '@leather-wallet/models';
import { Box, Flex, styled } from 'leather-styles/jsx';

import { capitalize } from '@app/common/utils';
import { spamFilter } from '@app/common/utils/spam-filter';
import { BulletSeparator } from '@app/ui/components/bullet-separator/bullet-separator';
import { ItemLayout } from '@app/ui/components/item-layout/item-layout';
import { SkeletonLoader } from '@app/ui/components/skeleton-loader/skeleton-loader';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';
import { Caption } from '@app/ui/components/typography/caption';
import { Pressable } from '@app/ui/pressable/pressable';

import { parseCryptoAssetBalance } from './crypto-asset-item.utils';

interface CryptoAssetItemLayoutProps {
  additionalBalanceInfo?: ReactNode;
  additionalUsdBalanceInfo?: ReactNode;
  address?: string;
  assetBalance: CryptoAssetBalances;
  icon: React.ReactNode;
  isLoading?: boolean;
  name: string;
  onClick?(): void;
  rightElement?: React.ReactNode;
  usdBalance?: string;
}
export function CryptoAssetItemLayout({
  additionalBalanceInfo,
  additionalUsdBalanceInfo,
  address = '',
  assetBalance,
  icon,
  isLoading = false,
  name,
  onClick,
  rightElement,
  usdBalance,
}: CryptoAssetItemLayoutProps) {
  const { balance, dataTestId, formattedBalance } = parseCryptoAssetBalance(assetBalance);
  const title = spamFilter(capitalize(name));

  const titleRight = (
    <SkeletonLoader width="126px" isLoading={isLoading}>
      {rightElement ? (
        rightElement
      ) : (
        <BasicTooltip
          asChild
          label={
            formattedBalance.isAbbreviated ? balance.availableBalance.amount.toString() : undefined
          }
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
              <Caption>
                {balance.availableBalance.amount.toNumber() > 0 && address ? usdBalance : null}
              </Caption>
              {additionalUsdBalanceInfo}
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
      captionLeft={balance.availableBalance.symbol}
      titleRight={titleRight}
      captionRight={captionRight}
    />
  );

  if (isInteractive)
    return (
      <Pressable data-testid={dataTestId} onClick={onClick} my="space.02">
        {content}
      </Pressable>
    );

  return <Box my="space.02">{content}</Box>;
}
