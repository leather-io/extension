import { useRef, useState } from 'react';

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
import { AssetContextMenu } from '@app/components/context-menu/asset-context-menu';
import { PrivateTextLayout } from '@app/components/privacy/private-text.layout';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useNativeSegwitAccountIndexAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { availableBalanceString, formattedBalance } = parseCryptoAssetBalance(availableBalance);
  const spamFilter = useSpamFilterWithWhitelist();
  const currentAccountIndex = useCurrentAccountIndex();
  const currentStacksAccount = useCurrentStacksAccount();
  const btcAddress = useNativeSegwitAccountIndexAddressIndexZero(currentAccountIndex);

  const isBtcToken = availableBalance.symbol.toLowerCase() === 'btc';
  const address = isBtcToken ? btcAddress : currentStacksAccount?.address;

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

  const content = (
    <ItemLayout
      img={icon}
      titleLeft={spamFilter(titleLeft)}
      captionLeft={spamFilter(captionLeft)}
      titleRight={titleRight}
      captionRight={captionRight}
    />
  );

  return (
    <Box data-testid={sanitize(dataTestId)} ref={menuRef}>
      <AssetContextMenu
        assetSymbol={availableBalance.symbol}
        contractId={contractId}
        address={address || ''}
      >
        <Pressable
          className="group"
          borderRadius="sm"
          width="100%"
          py="space.02"
          position="relative"
          _before={{
            content: '""',
            rounded: 'xs',
            position: 'absolute',
            top: '-space.01',
            left: '-space.03',
            bottom: '-space.01',
            right: '-space.03',
          }}
          _hover={{
            _before: {
              bg: 'ink.component-background-hover',
              borderColor: 'transparent',
            },
          }}
          onClick={(e: React.MouseEvent) => {
            if (onSelectAsset) {
              onSelectAsset(availableBalance.symbol, contractId);
              e.stopPropagation();
              return;
            }
          }}
        >
          {content}
        </Pressable>
      </AssetContextMenu>
    </Box>
  );
}
