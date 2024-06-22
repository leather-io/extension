import { type ReactNode } from 'react';

import { Box, Flex, styled } from 'leather-styles/jsx';

import type { Money } from '@leather.io/models';
import { BulletSeparator, Caption, ItemLayout, Pressable, SkeletonLoader } from '@leather.io/ui';
import { spamFilter } from '@leather.io/utils';

import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

import { getCryptoDataTestId, parseCryptoAssetBalance } from './crypto-asset-item.layout.utils';

interface CryptoAssetItemLayoutProps {
  availableBalance?: Money | null;
  balanceSuffix?: string;
  captionLeft: string;
  captionRightBulletInfo?: React.ReactNode;
  contractId?: string;
  fiatBalance?: string;
  icon: React.ReactNode;
  isLoading?: boolean;
  onSelectAsset?(symbol: string, contractId?: string): void;
  titleLeft: string;
  titleRightBulletInfo?: React.ReactNode;
  renderRightElement?(id: string): ReactNode;
}
export function CryptoAssetItemLayout({
  availableBalance,
  balanceSuffix,
  captionLeft,
  captionRightBulletInfo,
  contractId,
  fiatBalance,
  icon,
  isLoading = false,
  onSelectAsset,
  titleLeft,
  titleRightBulletInfo,
  renderRightElement,
}: CryptoAssetItemLayoutProps) {
  let titleRight: ReactNode | undefined = undefined;
  let captionRight: ReactNode | undefined = undefined;

  const symbol = availableBalance?.symbol ?? captionLeft;

  const dataTestId = getCryptoDataTestId(symbol);

  if (availableBalance) {
    const { availableBalanceString, formattedBalance } = parseCryptoAssetBalance(availableBalance);

    titleRight = (
      <SkeletonLoader width="126px" isLoading={isLoading}>
        <BasicTooltip
          asChild
          label={formattedBalance.isAbbreviated ? availableBalanceString : undefined}
          side="left"
        >
          <Flex alignItems="center" gap="space.02" textStyle="label.02">
            <BulletSeparator>
              <styled.span>
                {formattedBalance.value} {balanceSuffix}
              </styled.span>
              {titleRightBulletInfo}
            </BulletSeparator>
          </Flex>
        </BasicTooltip>
      </SkeletonLoader>
    );

    captionRight = (
      <SkeletonLoader width="78px" isLoading={isLoading}>
        <Flex alignItems="center" color="ink.text-subdued" gap="space.02">
          <BulletSeparator>
            <Caption>{availableBalance.amount.toNumber() > 0 ? fiatBalance : null}</Caption>
            {captionRightBulletInfo}
          </BulletSeparator>
        </Flex>
      </SkeletonLoader>
    );
  } else if (renderRightElement) {
    titleRight = renderRightElement(contractId ?? titleLeft);
  }

  const isInteractive = !!onSelectAsset;

  const content = (
    <ItemLayout
      flagImg={icon}
      titleLeft={spamFilter(titleLeft)}
      captionLeft={captionLeft}
      titleRight={titleRight}
      captionRight={captionRight}
    />
  );

  if (isInteractive)
    return (
      <Pressable
        data-testid={dataTestId}
        onClick={() => onSelectAsset(symbol, contractId)}
        my="space.02"
      >
        {content}
      </Pressable>
    );

  return <Box my="space.02">{content}</Box>;
}
