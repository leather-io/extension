import { BoxProps, Flex, HStack, styled } from 'leather-styles/jsx';

import type { Money } from '@shared/models/money.model';

import { formatBalance } from '@app/common/format-balance';
import { AssetCaption } from '@app/components/crypto-assets/components/asset-caption';
import { usePressable } from '@app/components/item-hover';
import { Flag } from '@app/components/layout/flag';
import { Tooltip } from '@app/components/tooltip';
import { Brc20TokenIcon } from '@app/ui/components/icons/brc20-token-icon';

interface Brc20TokenAssetItemLayoutProps extends BoxProps {
  balance: Money;
  caption: string;
  isPressable?: boolean;
  title: string;
}
export function Brc20TokenAssetItemLayout({
  balance,
  caption,
  isPressable,
  title,
}: Brc20TokenAssetItemLayoutProps) {
  const [component, bind] = usePressable(isPressable);

  const formattedBalance = formatBalance(balance.amount.toString());

  return (
    // #4476 TODO not sure why this isn't erroring
    <Flex as={isPressable ? 'button' : 'div'} outline={0} {...(bind as any)}>
      <Flag align="middle" img={<Brc20TokenIcon />} spacing="base" width="100%">
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
          <Tooltip
            label={formattedBalance.isAbbreviated ? balance.amount.toString() : undefined}
            placement="left-start"
          >
            <styled.span data-testid={title} textStyle="label.01">
              {formattedBalance.value}
            </styled.span>
          </Tooltip>
        </HStack>
        <HStack alignItems="center" justifyContent="space-between" height="1.25rem" width="100%">
          <AssetCaption caption={caption} />
        </HStack>
        {component}
      </Flag>
    </Flex>
  );
}
