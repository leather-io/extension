import { BoxProps, Flex, HStack, styled } from 'leather-styles/jsx';

import type { Money } from '@shared/models/money.model';

import { formatBalance } from '@app/common/format-balance';
import { AssetCaption } from '@app/components/crypto-assets/components/asset-caption';
import { usePressable } from '@app/components/item-hover';
import { Flag } from '@app/components/layout/flag';
import { Brc20TokenIcon } from '@app/ui/components/icons/brc20-token-icon';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

interface Brc20TokenAssetItemLayoutProps extends BoxProps {
  balance: Money;
  caption: string;
  isPressable?: boolean;
  onClick?(): void;
  title: string;
  displayNotEnoughBalance?: boolean;
}
export function Brc20TokenAssetItemLayout({
  balance,
  caption,
  isPressable,
  onClick,
  title,
  displayNotEnoughBalance,
}: Brc20TokenAssetItemLayoutProps) {
  const [component, bind] = usePressable(isPressable);

  const formattedBalance = formatBalance(balance.amount.toString());

  return (
    <BasicTooltip
      disabled={!displayNotEnoughBalance}
      side="top"
      label={'Not enough BTC in balance'}
      asChild
    >
      <Flex onClick={isPressable ? onClick : undefined} {...bind}>
        <Flag align="middle" img={<Brc20TokenIcon />} spacing="space.04" width="100%">
          <HStack alignItems="center" justifyContent="space-between" width="100%">
            <styled.span
              maxWidth="150px"
              overflow="hidden"
              textAlign="left"
              textOverflow="ellipsis"
              textStyle="label.01"
              whiteSpace="nowrap"
            >
              {title}
            </styled.span>
            <BasicTooltip
              label={formattedBalance.isAbbreviated ? balance.amount.toString() : undefined}
              side="left"
            >
              <styled.span data-testid={title} textStyle="label.01">
                {formattedBalance.value}
              </styled.span>
            </BasicTooltip>
          </HStack>
          <HStack alignItems="center" justifyContent="space-between" height="1.25rem" width="100%">
            <AssetCaption caption={caption} />
          </HStack>
          {component}
        </Flag>
      </Flex>
    </BasicTooltip>
  );
}
