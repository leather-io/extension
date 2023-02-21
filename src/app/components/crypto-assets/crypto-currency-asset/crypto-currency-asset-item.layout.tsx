import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiCopy } from 'react-icons/fi';

import { Box, Flex, StackProps, useClipboard } from '@stacks/ui';
import { forwardRefWithAs } from '@stacks/ui-core';
import { color, truncateMiddle } from '@stacks/ui-utils';
import { UserAreaSelectors } from '@tests-legacy/integration/user-area.selectors';
import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';

import { Money } from '@shared/models/money.model';

import { getFormattedBalance } from '@app/common/crypto-assets/stacks-crypto-asset.utils';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
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
  address: string;
}
export const CryptoCurrencyAssetItemLayout = forwardRefWithAs(
  (props: CryptoCurrencyAssetItemLayoutProps, ref) => {
    const { balance, caption, icon, isPressable, subBalance, title, address, ...rest } = props;
    const [component, bind] = usePressable(isPressable);
    const { onCopy } = useClipboard(address);
    const analytics = useAnalytics();
    const [isHovered, setIsHovered] = useState(false);

    const amount = balance.decimals
      ? ftDecimals(balance.amount, balance.decimals || 0)
      : balance.amount.toString();
    const dataTestId = CryptoAssetSelectors.CryptoAssetListItem.replace(
      '{symbol}',
      balance.symbol.toLowerCase()
    );
    const formattedBalance = getFormattedBalance(amount);
    const isUnanchored = !!(subBalance && !balance.amount.isEqualTo(subBalance.amount));

    function onHover() {
      setIsHovered(true);
    }

    function onBlur() {
      setIsHovered(false);
    }

    function onClick() {
      void analytics.track('copy_address_to_clipboard');
      onCopy();
      toast.success('Address copied!');
    }

    const CopyIcon = (
      <Flex alignItems="center" justifyContent="center" size="36px">
        <Box
          size="16px"
          color={color('text-caption')}
          data-testid={UserAreaSelectors.AccountCopyAddress}
          as={FiCopy}
          mt="2px"
        />
      </Flex>
    );
    return (
      <Flex
        as={isPressable ? 'button' : 'div'}
        data-testid={dataTestId}
        outline={0}
        ref={ref}
        {...rest}
        {...bind}
        onClick={onClick}
        onMouseOver={onHover}
        onMouseOut={onBlur}
      >
        <Flag img={isHovered ? CopyIcon : icon} align="middle" width="100%">
          <SpaceBetween width="100%">
            <Text>{isHovered ? truncateMiddle(address, 6) : title}</Text>
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
