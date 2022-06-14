import { ClarityValue, deserializeCV } from '@stacks/transactions';
import { color, Stack, Text } from '@stacks/ui';
import { useEffect, useState } from 'react';
import { sha256 } from 'sha.js';
import { ClarityValueListDisplayer } from './clarity-value-list';
import { HashDrawer } from './hash-drawer';
import { isStructuredMessage, SignatureMessage } from './sign-action';

export function MessageBox(props: SignatureMessage): JSX.Element | null {
  const { message, messageType } = props;
  const [hash, setHash] = useState<string | undefined>();
  const [displayMessage, setDisplayMessage] = useState<string[] | undefined>();
  const [clarityValueMessage, setClarityValueMessage] = useState<ClarityValue | undefined>();

  useEffect(() => {
    if (isStructuredMessage(messageType)) {
      setClarityValueMessage(deserializeCV(Buffer.from(message, 'hex')));
    } else {
      setDisplayMessage(message.split(/\r?\n/));
    }
  }, [message, messageType]);

  useEffect(() => {
    if (!message) return;
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
            bg={color('bg')}
            borderRadius="16px"
            fontSize={2}
            lineHeight="1.6"
            px="loose"
            py="loose"
            spacing="tight"
            wordBreak="break-all"
          >
            {clarityValueMessage && messageType === 'structured' ? (
              <Text>
                <ClarityValueListDisplayer encoding={'tryAscii'} val={clarityValueMessage} />
              </Text>
            ) : (
              displayMessage?.map(line => <Text>{line}</Text>)
            )}
          </Stack>
          {hash ? <HashDrawer hash={hash} /> : null}
        </Stack>
      </Stack>
    </>
  );
}
