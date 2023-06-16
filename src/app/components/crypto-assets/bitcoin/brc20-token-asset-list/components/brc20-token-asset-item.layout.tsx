import { BoxProps, Flex } from '@stacks/ui';
import { forwardRefWithAs } from '@stacks/ui-core';

import type { Money } from '@shared/models/money.model';

import { formatBalance } from '@app/common/format-balance';
import { AssetCaption } from '@app/components/crypto-assets/components/asset-caption';
import { Brc20TokenIcon } from '@app/components/icons/brc20-token-icon';
import { usePressable } from '@app/components/item-hover';
import { Flag } from '@app/components/layout/flag';
import { SpaceBetween } from '@app/components/layout/space-between';
import { Tooltip } from '@app/components/tooltip';
import { Text } from '@app/components/typography';

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
      <Flex as={isPressable ? 'button' : 'div'} outline={0} ref={ref} {...rest} {...bind}>
        <Flag align="middle" img={<Brc20TokenIcon />} width="100%">
          <SpaceBetween width="100%">
            <Text>{title}</Text>
            <Tooltip
              label={formattedBalance.isAbbreviated ? balance.amount.toString() : undefined}
              placement="left-start"
            >
              <Text data-testid={title} fontVariantNumeric="tabular-nums" textAlign="right">
                {formattedBalance.value}
              </Text>
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
