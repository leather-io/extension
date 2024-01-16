import { Box, Flex, styled } from 'leather-styles/jsx';

import { InfoIcon } from '@app/ui/components/icons/info-icon';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

const inMicroblockMessage =
  'This transaction is currently in a microblock, which increases the chances of inclusion in the next anchor block.';

export function MicroblockLabel() {
  return (
    <Flex alignItems="center">
      <styled.span color="warning.label" mr="space.01" textStyle="label.03">
        In microblock
      </styled.span>
      <BasicTooltip label={inMicroblockMessage} side="bottom">
        <Box _hover={{ cursor: 'pointer' }} color="warning.label">
          <InfoIcon />
        </Box>
      </BasicTooltip>
    </Flex>
  );
}
