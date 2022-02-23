import { Box, Flex, FlexProps } from '@stacks/ui';

import { useRemoteHiroMessages } from '@app/query/hiro-config/hiro-config.query';
import { HiroMessageItem } from './components/hiro-message-item';
import { useCurrentNetwork } from '@app/common/hooks/use-current-network';

export const HiroMessages = (props: FlexProps) => {
  const messages = useRemoteHiroMessages();
  const network = useCurrentNetwork();

  if (!messages || messages?.length === 0) return null;

  const firstMessage = messages[0];

  if (firstMessage.chainTarget !== 'all' && firstMessage.chainTarget !== network.mode) {
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
