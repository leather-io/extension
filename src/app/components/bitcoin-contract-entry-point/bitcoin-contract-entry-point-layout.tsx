import { Flex, HStack } from 'leather-styles/jsx';
import { StackProperties } from 'leather-styles/patterns';

import { Money } from '@shared/models/money.model';

import { formatBalance } from '@app/common/format-balance';
import { ftDecimals } from '@app/common/stacks-utils';
import { Flag } from '@app/components/layout/flag';
import { Tooltip } from '@app/components/tooltip';
import { Caption, Text } from '@app/components/typography';

import { LoadingSpinner } from '../loading-spinner';

interface BitcoinContractEntryPointLayoutProps extends StackProperties {
  balance: Money;
  caption: string;
  icon: React.JSX.Element;
  usdBalance?: string;
  isLoading?: boolean;
  cursor?: 'pointer' | 'default';
  onClick: () => void;
}
export function BitcoinContractEntryPointLayout(props: BitcoinContractEntryPointLayoutProps) {
  const { balance, caption, icon, usdBalance, isLoading, cursor, onClick } = props;

  const amount = balance.decimals
    ? ftDecimals(balance.amount, balance.decimals)
    : balance.amount.toString();
  const formattedBalance = formatBalance(amount);

  return (
    <Flex cursor={cursor} onClick={onClick} outline={0}>
      <Flag img={icon} align="middle" spacing="base" width="100%">
        <HStack alignItems="center" justifyContent="space-between" width="100%">
          <Text>{'Bitcoin Contracts'}</Text>
          <Tooltip
            label={formattedBalance.isAbbreviated ? balance.amount.toString() : undefined}
            placement="left-start"
          >
            <Text fontVariantNumeric="tabular-nums" textAlign="right">
              {isLoading ? <LoadingSpinner size="sm" /> : formattedBalance.value}
            </Text>
          </Tooltip>
        </HStack>
        <HStack height="1.25rem" alignItems="center" justifyContent="space-between" width="100%">
          <Caption>{caption}</Caption>
          <Flex>{isLoading ? '' : <Caption>{usdBalance}</Caption>}</Flex>
        </HStack>
      </Flag>
    </Flex>
  );
}
