import { Box, Flex, HStack, styled } from 'leather-styles/jsx';

import { InfoCircleIcon } from '@leather.io/ui';

import { PrivateTextLayout } from '@app/components/privacy/private-text.layout';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

interface AvailableBalanceProps {
  balance: string;
  balanceTooltipLabel?: string;
  isPrivate?: boolean;
}

export function AvailableBalance({
  balance,
  isPrivate,
  balanceTooltipLabel = 'Amount that is immediately available for use after taking into account any pending transactions or holds placed on your account by the protocol.',
}: AvailableBalanceProps) {
  return (
    <Flex alignItems="center" justifyContent="space-between">
      <HStack gap="space.01">
        <styled.span color="ink.text-subdued" textStyle="caption.01">
          Available balance
        </styled.span>
        <BasicTooltip asChild label={balanceTooltipLabel} side="top">
          <Box>
            <InfoCircleIcon color="ink.text-subdued" variant="small" />
          </Box>
        </BasicTooltip>
      </HStack>
      <styled.span color="ink.text-subdued" mr="space.02" textStyle="caption.01">
        <PrivateTextLayout isPrivate={isPrivate}>{balance}</PrivateTextLayout>
      </styled.span>
    </Flex>
  );
}
