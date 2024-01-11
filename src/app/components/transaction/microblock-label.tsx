import { Box, Flex, styled } from 'leather-styles/jsx';

import { Tooltip } from '@app/components/tooltip';
import { InfoIcon } from '@app/ui/components/icons/info-icon';

const inMicroblockMessage =
  'This transaction is currently in a microblock, which increases the chances of inclusion in the next anchor block.';

export function MicroblockLabel() {
  return (
    <Flex alignItems="center">
      <styled.span color="warning.label" mr="space.01" textStyle="label.03">
        In microblock
      </styled.span>
      <Tooltip label={inMicroblockMessage} placement="bottom">
        <Box _hover={{ cursor: 'pointer' }} color="warning.label">
          <InfoIcon />
        </Box>
      </Tooltip>
    </Flex>
  );
}
