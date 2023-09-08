import { forwardRefWithAs } from '@stacks/ui-core';
import { BoxProps, Flex } from 'leather-styles/jsx';
import { styled } from 'leather-styles/jsx';

import type { Money } from '@shared/models/money.model';

import { formatBalance } from '@app/common/format-balance';
import { AssetCaption } from '@app/components/crypto-assets/components/asset-caption';
import { Brc20TokenIcon } from '@app/components/icons/brc20-token-icon';
import { usePressable } from '@app/components/item-hover';
import { Flag } from '@app/components/layout/flag';
import { SpaceBetween } from '@app/components/layout/space-between';
import { Tooltip } from '@app/components/tooltip';

interface Brc20TokenAssetItemLayoutProps extends BoxProps {
  balance: Money;
  caption: string;
  isPressable?: boolean;
  title: string;
}
export const Brc20TokenAssetItemLayout = forwardRefWithAs(
  (props: Brc20TokenAssetItemLayoutProps, ref) => {
    const { balance, caption, isPressable, title, ...rest } = props;
    const [component, bind] = usePressable(isPressable);

    const formattedBalance = formatBalance(balance.amount.toString());

    return (
      <Flex as={isPressable ? 'button' : 'div'} outline={0} ref={ref} {...rest} {...(bind as any)}>
        <Flag align="middle" img={<Brc20TokenIcon />} gap="space.04" width="100%">
          <SpaceBetween width="100%">
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
          </SpaceBetween>
          <SpaceBetween height="1.25rem" width="100%">
            <AssetCaption caption={caption} />
          </SpaceBetween>
          {component}
        </Flag>
      </Flex>
    );
  }
);
