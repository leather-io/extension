import { Box, Stack, StackProps } from '@stacks/ui';
import { forwardRefWithAs } from '@stacks/ui-core';

import type { Money } from '@shared/models/money.model';

import { getFormattedBalance } from '@app/common/crypto-assets/stacks-crypto-asset.utils';
import { ftDecimals } from '@app/common/stacks-utils';
import { usePressable } from '@app/components/item-hover';
import { SpaceBetween } from '@app/components/space-between';
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
      <Box
        as={isPressable ? 'button' : 'div'}
        display="flex"
        textAlign="left"
        outline={0}
        position="relative"
        ref={ref}
        flexGrow={1}
        spacing="base"
        {...rest}
        {...bind}
      >
        <Stack alignItems="center" flexGrow={1} isInline spacing="base">
          {icon}
          <Stack flexGrow={1} spacing="none">
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
          </Stack>
        </Stack>
        {component}
      </Box>
    );
  }
);
