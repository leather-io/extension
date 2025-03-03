import { sanitize } from 'dompurify';
import { Box, Flex } from 'leather-styles/jsx';
import { useRef, useState } from 'react';

import type { Money } from '@leather.io/models';
import {
  BulletSeparator,
  Caption,
  DropdownMenu,
  ItemLayout,
  Pressable,
  SkeletonLoader,
  shimmerStyles,
} from '@leather.io/ui';

import { useSpamFilterWithWhitelist } from '@app/common/spam-filter/use-spam-filter';
import { PrivateTextLayout } from '@app/components/privacy/private-text.layout';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';
import { AssetContextMenu } from '@app/features/asset-list/_components/asset-context-menu';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useNativeSegwitAccountIndexAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

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
    <Box 
      data-testid={sanitize(dataTestId)}
      ref={menuRef}
    >
      <DropdownMenu.Root open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenu.Trigger asChild>
          <Pressable
            borderRadius="sm"
            _hover={{ bg: 'ink.component-background-hover' }}
            width="100%"
            onClick={(e: React.MouseEvent) => {
              if (onSelectAsset) {
                onSelectAsset(availableBalance.symbol, contractId);
                e.stopPropagation();
                return;
              }
            }}
            onContextMenu={(e: React.MouseEvent) => {
              e.preventDefault();
              setIsMenuOpen(true);
            }}
          >
            <Box px="space.03" py="space.03">
              {content}
            </Box>
          </Pressable>
        </DropdownMenu.Trigger>
        {isMenuOpen && (
          <AssetContextMenu
            assetSymbol={availableBalance.symbol}
            contractId={contractId}
            address={address || ''}
            onClose={() => setIsMenuOpen(false)}
          />
        )}
      </DropdownMenu.Root>
    </Box>
  );
}
