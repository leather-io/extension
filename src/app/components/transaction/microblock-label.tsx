import { FiInfo } from 'react-icons/fi';

import { Flex, Stack, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { Tooltip } from '@app/components/tooltip';

const inMicroblockMessage =
  'This transaction is currently in a microblock, which increases the chances of inclusion in the next anchor block.';

export function MicroblockLabel() {
  return (
    <Flex alignItems="center">
      <styled.span color={token('colors.error')} fontSize={0} mr="2px">
        In microblock
      </styled.span>
      <Tooltip label={inMicroblockMessage} placement="bottom">
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
