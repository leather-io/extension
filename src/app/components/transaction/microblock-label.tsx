import { FiInfo } from 'react-icons/fi';

import { Box, Flex, Stack, Text, color } from '@stacks/ui';

import { Tooltip } from '@app/components/tooltip';

const inMicroblockMessage =
  'This transaction is currently in a microblock, which increases the chances of inclusion in the next anchor block.';

export function MicroblockLabel() {
  return (
    <Flex alignItems="center">
      <Text
        color={color('feedback-alert')}
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
