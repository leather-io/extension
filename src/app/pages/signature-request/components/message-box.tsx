import { hashMessage } from '@stacks/encryption';
import { color, Stack, Text } from '@stacks/ui';
import { useEffect, useState } from 'react';
import { HashDrawer } from './hash-drawer';

export function MessageBox(props: { message: string }): JSX.Element | null {
  const { message } = props;

  const [hash, setHash] = useState<string | undefined>();
  const [displayMessage, setDisplayMessage] = useState<string[] | undefined>();

  useEffect(() => {
    setDisplayMessage(message.split(/\r?\n/));
  }, [message]);

  useEffect(() => {
    if (!message) return;
    const messageHash = hashMessage(message).toString('hex');
    setHash(messageHash);
  }, [message]);

  if (!message) return null;

  return (
    <Stack minHeight="260px">
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
          wordBreak="break-all"
        >
          {displayMessage?.map(line => (
            <Text>{line}</Text>
          ))}
        </Stack>
        {hash ? <HashDrawer hash={hash} /> : null}
      </Stack>
    </Stack>
  );
}
