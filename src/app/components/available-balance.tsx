import { FiInfo } from 'react-icons/fi';

import { Box, Flex, Stack, color } from '@stacks/ui';

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
        <Caption mr="tight">Available balance</Caption>
        <Tooltip placement="top" label={balanceTooltipLabel}>
          <Stack>
            <Box
              _hover={{ cursor: 'pointer' }}
              as={FiInfo}
              color={color('text-caption')}
              size="14px"
            />
          </Stack>
        </Tooltip>
      </Flex>
      <Caption>{formatMoney(balance)}</Caption>
    </SpaceBetween>
  );
}
