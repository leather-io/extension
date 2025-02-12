import { sanitize } from 'dompurify';
import { Box, Flex } from 'leather-styles/jsx';

import type { Money } from '@leather.io/models';
import {
  BulletSeparator,
  Caption,
  ItemLayout,
  Pressable,
  SkeletonLoader,
  shimmerStyles,
} from '@leather.io/ui';

import { useSpamFilterWithWhitelist } from '@app/common/spam-filter/use-spam-filter';
import { PrivateTextLayout } from '@app/components/privacy/private-text.layout';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

import { parseCryptoAssetBalance } from './crypto-asset-item.layout.utils';

export interface CryptoAssetItemLayoutProps {
  availableBalance: Money;
  balanceSuffix?: string;
  captionLeft: string;
  captionRightBulletInfo?: React.ReactNode;
  contractId?: string;
  fiatBalance?: string;
  icon: React.ReactNode;
  isLoading?: boolean;
  isLoadingAdditionalData?: boolean;
  isPrivate?: boolean;
  onSelectAsset?(symbol: string, contractId?: string): void;
  titleLeft: string;
  titleRightBulletInfo?: React.ReactNode;
  dataTestId: string;
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
  isLoadingAdditionalData = false,
  isPrivate = false,
  onSelectAsset,
  titleLeft,
  titleRightBulletInfo,
  dataTestId,
}: CryptoAssetItemLayoutProps) {
  const { availableBalanceString, formattedBalance } = parseCryptoAssetBalance(availableBalance);

  const spamFilter = useSpamFilterWithWhitelist();

  const titleRight = (
    <SkeletonLoader width="126px" isLoading={isLoading}>
      <BasicTooltip
        asChild
        label={formattedBalance.isAbbreviated && !isPrivate ? availableBalanceString : undefined}
        side="left"
      >
        <Flex alignItems="center" gap="space.02" textStyle="label.02">
          <BulletSeparator>
            <PrivateTextLayout
              isPrivate={isPrivate}
              data-state={isLoadingAdditionalData ? 'loading' : undefined}
              className={shimmerStyles}
            >
              {formattedBalance.value} {balanceSuffix}
            </PrivateTextLayout>
            {titleRightBulletInfo}
          </BulletSeparator>
        </Flex>
      </BasicTooltip>
    </SkeletonLoader>
  );

  const captionRight = (
    <SkeletonLoader width="78px" isLoading={isLoading}>
      <Flex alignItems="center" color="ink.text-subdued" gap="space.02">
        <BulletSeparator>
          <Caption
            data-state={isLoadingAdditionalData ? 'loading' : undefined}
            className={shimmerStyles}
          >
            <PrivateTextLayout isPrivate={isPrivate}>
              {availableBalance.amount.toNumber() > 0 ? fiatBalance : null}
            </PrivateTextLayout>
          </Caption>
          {captionRightBulletInfo}
        </BulletSeparator>
      </Flex>
    </SkeletonLoader>
  );

  const isInteractive = !!onSelectAsset;

  const content = (
    <ItemLayout
      img={icon}
      titleLeft={spamFilter(titleLeft)}
      captionLeft={spamFilter(captionLeft)}
      titleRight={titleRight}
      captionRight={captionRight}
    />
  );

  if (isInteractive)
    return (
      <Pressable
        data-testid={dataTestId}
        onClick={() => onSelectAsset(availableBalance.symbol, contractId)}
        my="space.02"
      >
        {content}
      </Pressable>
    );

  return (
    <Box my="space.02" data-testid={sanitize(dataTestId)}>
      {content}
    </Box>
  );
}
