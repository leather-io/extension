// #4164 FIXME this is almost identical to MicroblockLabel
import { FiInfo } from 'react-icons/fi';

import { Flex, Stack, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { Tooltip } from '@app/components/tooltip';

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
      <styled.span color={token('colors.accent.warning')} fontSize={0} mr="2px">
        Pending
      </styled.span>
      <Tooltip label={pendingWaitingMessage} placement="bottom">
        <Stack _hover={{ cursor: 'pointer' }}>
          <FiInfo
            // #4164 FIXME migrate feedback-alert
            // color('feedback-alert')
            color={token('colors.accent.warning')}
            style={{ marginLeft: '2px' }}
            size="10px"
          />
        </Stack>
      </Tooltip>
    </Flex>
  );
}
