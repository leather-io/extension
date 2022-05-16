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
  const [displayMessage, setDisplayMessage] = useState<string | undefined>();
  const [clarityValueMessage, setClarityValueMessage] = useState<ClarityValue | undefined>();

  useEffect(() => {
    if (isStructuredMessage(messageType)) {
      setClarityValueMessage(deserializeCV(Buffer.from(message, 'hex')));
    } else {
      setDisplayMessage(message);
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
            py="loose"
            px="loose"
            spacing="loose"
            borderRadius="16px"
            backgroundColor={'white'}
          >
            <Stack spacing="base-tight">
              <Text display="block" fontSize={2} lineHeight="1.6" wordBreak="break-all">
                {clarityValueMessage && messageType === 'structured' ? (
                  <ClarityValueListDisplayer val={clarityValueMessage} encoding={'tryAscii'} />
                ) : (
                  displayMessage
                )}
              </Text>
            </Stack>
          </Stack>
          {hash ? <HashDrawer hash={hash} /> : null}
        </Stack>
      </Stack>
    </>
  );
}
