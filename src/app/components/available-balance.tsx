import { FiInfo } from 'react-icons/fi';

// PETE - start with Flex / Box and work from there
// - see whats the easiest to move to panda first //stacks/ui'
import { Flex, Stack, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { Money } from '@shared/models/money.model';

import { formatMoney } from '@app/common/money/format-money';
import { SpaceBetween } from '@app/components/layout/space-between';
import { Tooltip } from '@app/components/tooltip';
import { Caption } from '@app/components/typography';

export function AvailableBalance(props: { balance: Money; balanceTooltipLabel?: string }) {
  const {
    balance,
    balanceTooltipLabel = 'Amount that is immediately available for use after taking into account any pending transactions or holds placed on your account by the protocol.',
  } = props;

  return (
    <SpaceBetween>
      <Flex alignItems="center">
        <Caption mr="space.02">Available balance</Caption>
        <Tooltip placement="top" label={balanceTooltipLabel}>
          <Stack>
            {/* TODO: refactor this to be a generic icon wrapper */}
            <styled.span textStyle="caption.01" _hover={{ cursor: 'pointer' }}>
              <FiInfo color={token('colors.brown.12')} size="14px" />
            </styled.span>
          </Stack>
        </Tooltip>
      </Flex>
      <Caption>{formatMoney(balance)}</Caption>
    </SpaceBetween>
  );
}
