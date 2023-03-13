import { FiInfo } from 'react-icons/fi';

import { Box, Flex, Stack, Text, color } from '@stacks/ui';

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
      <Text color={color('feedback-alert')} fontSize={0} mr="2px">
        Pending
      </Text>
      <Tooltip label={pendingWaitingMessage} placement="bottom">
        <Stack>
          <Box
            _hover={{ cursor: 'pointer' }}
            as={FiInfo}
            color={color('feedback-alert')}
            ml="2px"
            size="10px"
          />
        </Stack>
      </Tooltip>
    </Flex>
  );
}
