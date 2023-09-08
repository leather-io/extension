import { forwardRefWithAs } from '@stacks/ui-core';
import { truncateMiddle } from '@stacks/ui-utils';
import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';
import { Flex, StackProps } from 'leather-styles/jsx';
import { styled } from 'leather-styles/jsx';

import { CryptoCurrencies } from '@shared/models/currencies.model';
import { Money } from '@shared/models/money.model';

import { formatBalance } from '@app/common/format-balance';
import { ftDecimals } from '@app/common/stacks-utils';
import { usePressable } from '@app/components/item-hover';
import { Flag } from '@app/components/layout/flag';
import { SpaceBetween } from '@app/components/layout/space-between';
import { Tooltip } from '@app/components/tooltip';

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

// const Wrapper = (props: CryptoCurrencyAssetItemLayoutProps) => {
//   props.isPressable ? (
//     <styled.button {...props}>{props.children}</styled.button>
//   ) : (
//     <styled.div {...props}>{props.children}</styled.div>
//   );
// };

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
        // #4164 FIXME migrate - check if this needs to change between button / div
        // if so use Wrapper
        // as={isPressable ? 'button' : 'div'}
        data-testid={dataTestId}
        outline={0}
        ref={ref}
        {...rest}
        {...bind}
      >
        <Flag
          align="middle"
          img={isHovered && copyIcon ? copyIcon : icon}
          gap="space.04"
          width="100%"
        >
          <SpaceBetween width="100%">
            <styled.span textStyle="label.01">
              {isHovered ? truncateMiddle(address, 6) : title}
            </styled.span>
            <Tooltip
              label={formattedBalance.isAbbreviated ? balance.amount.toString() : undefined}
              placement="left-start"
            >
              <styled.span data-testid={title} textStyle="label.01">
                {formattedBalance.value} {additionalBalanceInfo}
              </styled.span>
            </Tooltip>
          </SpaceBetween>
          <SpaceBetween height="1.25rem" width="100%">
            <styled.span textStyle="caption.02">{caption}</styled.span>
            <Flex>
              {balance.amount.toNumber() > 0 && address ? (
                <styled.span textStyle="caption.02">{usdBalance}</styled.span>
              ) : null}
              {additionalUsdBalanceInfo}
            </Flex>
          </SpaceBetween>
        </Flag>
        {component}
      </Flex>
    );
  }
);
