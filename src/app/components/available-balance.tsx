import { Box, Flex, HStack, styled } from 'leather-styles/jsx';

import { Money } from '@shared/models/money.model';

import { formatMoney } from '@app/common/money/format-money';
import { InfoIcon } from '@app/ui/components/icons/info-icon';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

export function AvailableBalance(props: { balance: Money; balanceTooltipLabel?: string }) {
  const {
    balance,
    balanceTooltipLabel = 'Amount that is immediately available for use after taking into account any pending transactions or holds placed on your account by the protocol.',
  } = props;

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <HStack gap="space.01">
        <styled.span color="accent.text-subdued" textStyle="caption.01">
          Available balance
        </styled.span>
        <BasicTooltip label={balanceTooltipLabel} side="top">
          <Box>
            <InfoIcon color="accent.text-subdued" size="xs" />
          </Box>
        </BasicTooltip>
      </HStack>
      <styled.span color="accent.text-subdued" mr="space.02" textStyle="caption.01">
        {formatMoney(balance)}
      </styled.span>
    </Flex>
  );
}
