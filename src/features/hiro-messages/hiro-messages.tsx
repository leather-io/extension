import React from 'react';
import { Box, Flex, FlexProps } from '@stacks/ui';

import { useHiroMessages } from '@common/hooks/use-hiro-messages';
import { HiroMessageItem } from './components/hiro-message-item';

export const HiroMessages = (props: FlexProps) => {
  const messages = useHiroMessages();
  if (!messages || !messages.global || !messages.global[0]) return null;

  return (
    <Box pt="tight">
      <Flex background="#F7F8FD" borderRadius="8px" p="base" {...props}>
        <HiroMessageItem {...messages.global[0]} />
      </Flex>
    </Box>
  );
};
