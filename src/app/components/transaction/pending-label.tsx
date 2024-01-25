import { Box, Flex, styled } from 'leather-styles/jsx';

import { InfoIcon } from '@app/ui/components/icons/info-icon';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

const defaultPendingWaitingMessage =
  'This transaction is waiting to be confirmed. Depending on network congestion, this may take anywhere from a few minutes, to a couple of hours.';

interface PendingLabelProps {
  pendingWaitingMessage?: string;
}

export function PendingLabel({
  pendingWaitingMessage = defaultPendingWaitingMessage,
}: PendingLabelProps) {
  return (
    <Flex alignItems="center">
      <styled.span color="warning.label" mr="space.01" textStyle="label.03">
        Pending
      </styled.span>
      <BasicTooltip label={pendingWaitingMessage} side="bottom">
        <Box>
          <InfoIcon color="warning.label" size="xs" />
        </Box>
      </BasicTooltip>
    </Flex>
  );
}
