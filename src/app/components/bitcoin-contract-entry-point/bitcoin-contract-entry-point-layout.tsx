import { Flex, HStack, styled } from 'leather-styles/jsx';

import { Money } from '@shared/models/money.model';

import { formatBalance } from '@app/common/format-balance';
import { ftDecimals } from '@app/common/stacks-utils';
import { Flag } from '@app/components/layout/flag';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

import { LoadingSpinner } from '../loading-spinner';

interface BitcoinContractEntryPointLayoutProps {
  balance: Money;
  caption: string;
  icon: React.JSX.Element;
  usdBalance?: string;
  isLoading?: boolean;
  cursor?: 'pointer' | 'default';
  onClick(): void;
}
export function BitcoinContractEntryPointLayout(props: BitcoinContractEntryPointLayoutProps) {
  const { balance, caption, icon, usdBalance, isLoading, cursor, onClick } = props;

  const amount = balance.decimals
    ? ftDecimals(balance.amount, balance.decimals)
    : balance.amount.toString();
  const formattedBalance = formatBalance(amount);

  if (Number(balance.amount) === 0) return null;

  return (
    <Flex cursor={cursor} onClick={onClick} outline={0}>
      <Flag align="middle" img={icon} spacing="space.04" width="100%">
        <HStack alignItems="center" justifyContent="space-between" width="100%">
          <styled.span textStyle="label.01">Bitcoin Contracts</styled.span>
          <BasicTooltip
            label={formattedBalance.isAbbreviated ? balance.amount.toString() : undefined}
            side="left"
          >
            <styled.span textStyle="label.01">
              {isLoading ? <LoadingSpinner size="sm" /> : formattedBalance.value}
            </styled.span>
          </BasicTooltip>
        </HStack>
        <HStack alignItems="center" justifyContent="space-between" width="100%">
          <styled.span textStyle="caption.02">{caption}</styled.span>
          <Flex>
            {isLoading ? '' : <styled.span textStyle="caption.02">{usdBalance}</styled.span>}
          </Flex>
        </HStack>
      </Flag>
    </Flex>
  );
}
