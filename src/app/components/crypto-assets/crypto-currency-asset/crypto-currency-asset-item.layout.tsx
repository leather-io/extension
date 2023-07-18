import { Flex, StackProps } from '@stacks/ui';
import { forwardRefWithAs } from '@stacks/ui-core';
import { truncateMiddle } from '@stacks/ui-utils';
import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';

import { CryptoCurrencies } from '@shared/models/currencies.model';
import { Money } from '@shared/models/money.model';

import { formatBalance } from '@app/common/format-balance';
import { ftDecimals } from '@app/common/stacks-utils';
import { usePressable } from '@app/components/item-hover';
import { Flag } from '@app/components/layout/flag';
import { SpaceBetween } from '@app/components/layout/space-between';
import { Tooltip } from '@app/components/tooltip';
import { Caption, Text } from '@app/components/typography';

interface CryptoCurrencyAssetItemLayoutProps extends StackProps {
  balance: Money;
  caption: string;
  icon: React.JSX.Element;
  copyIcon?: React.JSX.Element;
  isPressable?: boolean;
  title: string;
  usdBalance?: string;
  address?: string;
  canCopy?: boolean;
  isHovered?: boolean;
  currency?: CryptoCurrencies;
  additionalBalanceInfo?: React.JSX.Element;
  additionalUsdBalanceInfo?: React.JSX.Element;
}
export const CryptoCurrencyAssetItemLayout = forwardRefWithAs(
  (props: CryptoCurrencyAssetItemLayoutProps, ref) => {
    const {
      balance,
      caption,
      icon,
      copyIcon,
      isPressable,
      title,
      usdBalance,
      address = '',
      isHovered = false,
      additionalBalanceInfo,
      additionalUsdBalanceInfo,
      ...rest
    } = props;
    const [component, bind] = usePressable(isPressable);

    const amount = balance.decimals
      ? ftDecimals(balance.amount, balance.decimals)
      : balance.amount.toString();
    const dataTestId = CryptoAssetSelectors.CryptoAssetListItem.replace(
      '{symbol}',
      balance.symbol.toLowerCase()
    );
    const formattedBalance = formatBalance(amount);

    return (
      <Flex
        as={isPressable ? 'button' : 'div'}
        data-testid={dataTestId}
        outline={0}
        ref={ref}
        {...rest}
        {...bind}
      >
        <Flag img={isHovered && copyIcon ? copyIcon : icon} align="middle" width="100%">
          <SpaceBetween width="100%">
            <Text>{isHovered ? truncateMiddle(address, 6) : title}</Text>
            <Tooltip
              label={formattedBalance.isAbbreviated ? balance.amount.toString() : undefined}
              placement="left-start"
            >
              <Text data-testid={title} fontVariantNumeric="tabular-nums" textAlign="right">
                {formattedBalance.value} {additionalBalanceInfo}
              </Text>
            </Tooltip>
          </SpaceBetween>
          <SpaceBetween height="1.25rem" width="100%">
            <Caption>{caption}</Caption>
            <Flex>
              {balance.amount.toNumber() > 0 && address ? <Caption>{usdBalance}</Caption> : null}
              {additionalUsdBalanceInfo}
            </Flex>
          </SpaceBetween>
        </Flag>
        {component}
      </Flex>
    );
  }
);
