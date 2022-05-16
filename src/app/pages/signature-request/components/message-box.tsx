import { color, Stack, Text } from '@stacks/ui';
import { sha256 } from 'sha.js';
import { HashDrawer } from './hash-drawer';
import { useEffect, useState } from 'react';

interface MessageBoxProps {
  message: string;
}
export function MessageBox(props: MessageBoxProps): JSX.Element | null {
  const { message } = props;
  const [hash, setHash] = useState<string | undefined>();
  useEffect(() => {
    setHash(new sha256().update(message).digest('hex'));
  }, [message]);

  if (!message) return null;

  return (
    <>
      <Stack minHeight={'260px'}>
        <Stack
          border="4px solid"
          paddingBottom={'8px'}
          borderColor={color('border')}
          borderRadius="20px"
          backgroundColor={color('border')}
        >
          <Stack
            py="loose"
            px="loose"
            spacing="loose"
            borderRadius="16px"
            backgroundColor={'white'}
          >
            <Stack spacing="base-tight">
              <Text display="block" fontSize={2} lineHeight="1.6" wordBreak="break-all">
                {message}
              </Text>
            </Stack>
          </Stack>
          {hash ? <HashDrawer hash={hash} /> : null}
        </Stack>
      </Stack>
    </>
  );
}
