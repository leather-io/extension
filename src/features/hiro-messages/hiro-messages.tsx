import { Box, Flex, FlexProps } from '@stacks/ui';

import { useRemoteHiroConfig } from '@query/hiro-config/hiro-config.query';
import { HiroMessageItem } from './components/hiro-message-item';

export const HiroMessages = (props: FlexProps) => {
  const config = useRemoteHiroConfig();
  if (!config?.messages?.global?.[0]) return null;

  return (
    <Box pt="tight">
      <Flex background="#F7F8FD" borderRadius="8px" p="base" {...props}>
        <HiroMessageItem {...config.messages.global[0]} />
      </Flex>
    </Box>
  );
};
