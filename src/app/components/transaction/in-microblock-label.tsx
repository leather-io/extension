import { FiInfo } from 'react-icons/fi';

import { Box, Flex, Stack, Text, color } from '@stacks/ui';
import { SendFormSelectors } from '@tests-legacy/page-objects/send-form.selectors';

import { Tooltip } from '@app/components/tooltip';

const inMicroblockMessage =
  'This transaction is currently in microblock, waiting for its associated anchor block to be approved.';

export function InMicroblockLabel() {
  return (
    <Flex alignItems="center">
      <Text
        color={color('feedback-alert')}
        data-testid={SendFormSelectors.PendingStatus}
        fontSize={0}
        mr="2px"
      >
        In microblock
      </Text>
      <Tooltip label={inMicroblockMessage} placement="bottom">
        <Stack>
          <Box
            _hover={{ cursor: 'pointer' }}
            as={FiInfo}
            color={color('feedback-alert')}
            ml={'2px'}
            size="10px"
          />
        </Stack>
      </Tooltip>
    </Flex>
  );
}
