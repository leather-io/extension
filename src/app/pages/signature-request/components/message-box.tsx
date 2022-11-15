import { useEffect, useState } from 'react';

import { bytesToHex } from '@stacks/common';
import { hashMessage } from '@stacks/encryption';
import { Box, Stack, Text, color } from '@stacks/ui';

import { HashDrawer } from './hash-drawer';

interface MessageBoxProps {
  message: string;
}
export function MessageBox({ message }: MessageBoxProps) {
  const [hash, setHash] = useState<string | undefined>();
  const [displayMessage, setDisplayMessage] = useState<string[] | undefined>();

  useEffect(() => {
    setDisplayMessage(message.split(/\r?\n/));
  }, [message]);

  useEffect(() => {
    if (!message) return;
    const messageHash = bytesToHex(hashMessage(message));
    setHash(messageHash);
  }, [message]);

  if (!message) return null;

  return (
    <Box minHeight="260px">
      <Stack
        border="4px solid"
        paddingBottom="8px"
        borderColor={color('border')}
        borderRadius="20px"
        backgroundColor={color('border')}
      >
        <Stack
          bg={color('bg')}
          borderRadius="16px"
          fontSize={2}
          lineHeight="1.6"
          px="loose"
          py="loose"
          spacing="tight"
          overflowX="scroll"
        >
          {displayMessage?.map(line => (
            <Text key={line}>{line}</Text>
          ))}
        </Stack>
        {hash ? <HashDrawer hash={hash} /> : null}
      </Stack>
    </Box>
  );
}
