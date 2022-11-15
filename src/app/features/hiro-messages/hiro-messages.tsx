import { Box, Flex, FlexProps } from '@stacks/ui';

import { useRemoteHiroMessages } from '@app/query/common/hiro-config/hiro-config.query';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { HiroMessageItem } from './components/hiro-message-item';

export const HiroMessages = (props: FlexProps) => {
  const messages = useRemoteHiroMessages();
  const { mode } = useCurrentNetworkState();

  if (!messages || messages?.length === 0) return null;

  const firstMessage = messages[0];

  if (firstMessage.chainTarget !== 'all' && firstMessage.chainTarget !== mode) {
    return null;
  }

  return (
    <Box pt="tight">
      <Flex background="#F7F8FD" borderRadius="8px" p="base" {...props}>
        <HiroMessageItem {...firstMessage} />
      </Flex>
    </Box>
  );
};
