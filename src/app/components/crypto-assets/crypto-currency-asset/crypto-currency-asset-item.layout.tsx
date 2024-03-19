import { ReactNode } from 'react';

import { Flex, styled } from 'leather-styles/jsx';

import { AllCryptoCurrencyAssetBalances } from '@shared/models/crypto-asset-balance.model';

import { BulletSeparator } from '@app/ui/components/bullet-separator/bullet-separator';
import { ItemLayout } from '@app/ui/components/item-layout/item-layout';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';
import { Caption } from '@app/ui/components/typography/caption';
import { Pressable } from '@app/ui/pressable/pressable';

import { parseCryptoCurrencyAssetBalance } from './crypto-currency-asset.utils';

interface CryptoCurrencyAssetItemLayoutProps {
  additionalBalanceInfo?: ReactNode;
  additionalUsdBalanceInfo?: ReactNode;
  address?: string;
  assetBalance: AllCryptoCurrencyAssetBalances;
  icon: React.ReactNode;
  onClick?(): void;
  rightElement?: React.ReactNode;
  usdBalance?: string;
}
export function CryptoCurrencyAssetItemLayout({
  additionalBalanceInfo,
  additionalUsdBalanceInfo,
  address = '',
  assetBalance,
  icon,
  onClick,
  rightElement,
  usdBalance,
}: CryptoCurrencyAssetItemLayoutProps) {
  const { balance, dataTestId, formattedBalance, title } =
    parseCryptoCurrencyAssetBalance(assetBalance);

  return (
    <Pressable data-testid={dataTestId} onClick={onClick} my="space.02">
      <ItemLayout
        flagImg={icon}
        titleLeft={title}
        captionLeft={balance.symbol}
        titleRight={
          rightElement ? (
            rightElement
          ) : (
            <BasicTooltip
              asChild
              label={formattedBalance.isAbbreviated ? balance.amount.toString() : undefined}
              side="left"
            >
              <styled.span data-testid={title} fontWeight={500} textStyle="label.02">
                {formattedBalance.value} {additionalBalanceInfo}
              </styled.span>
            </BasicTooltip>
          )
        }
        captionRight={
          !rightElement && (
            <Caption>
              <Flex alignItems="center" gap="space.02" color="inherit">
                <BulletSeparator>
                  <Caption>{balance.amount.toNumber() > 0 && address ? usdBalance : null}</Caption>
                  {additionalUsdBalanceInfo}
                </BulletSeparator>
              </Flex>
            </Caption>
          )
        }
      />
    </Pressable>
  );
}
