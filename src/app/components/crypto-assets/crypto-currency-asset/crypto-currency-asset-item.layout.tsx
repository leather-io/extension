import { Flex, StackProps } from '@stacks/ui';
import { forwardRefWithAs } from '@stacks/ui-core';

import { Money } from '@shared/models/money.model';

import { getFormattedBalance } from '@app/common/crypto-assets/stacks-crypto-asset.utils';
import { ftDecimals } from '@app/common/stacks-utils';
import { usePressable } from '@app/components/item-hover';
import { Flag } from '@app/components/layout/flag';
import { SpaceBetween } from '@app/components/layout/space-between';
import { Tooltip } from '@app/components/tooltip';
import { Caption, Text } from '@app/components/typography';

import { SubBalance } from '../components/sub-balance';

interface CryptoCurrencyAssetItemLayoutProps extends StackProps {
  balance: Money;
  caption: string;
  icon: JSX.Element;
  isPressable?: boolean;
  subBalance?: Money;
  title: string;
}
export const CryptoCurrencyAssetItemLayout = forwardRefWithAs(
  (props: CryptoCurrencyAssetItemLayoutProps, ref) => {
    const { balance, caption, icon, isPressable, subBalance, title, ...rest } = props;
    const [component, bind] = usePressable(isPressable);

    const amount = balance.decimals
      ? ftDecimals(balance.amount, balance.decimals || 0)
      : balance.amount.toString();
    const formattedBalance = getFormattedBalance(amount);
    const isUnanchored = !!(subBalance && !balance.amount.isEqualTo(subBalance.amount));

    return (
      <Flex as={isPressable ? 'button' : 'div'} outline={0} ref={ref} {...rest} {...bind}>
        <Flag img={icon} align="middle" width="100%">
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
            <Caption>{caption}</Caption>
            {isUnanchored && subBalance ? <SubBalance balance={subBalance} /> : null}
          </SpaceBetween>
        </Flag>
        {component}
      </Flex>
    );
  }
);
