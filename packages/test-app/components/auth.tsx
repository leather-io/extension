import React from 'react';
import { Button, Text, Box, space, ButtonGroup } from '@blockstack/ui';
import { useConnect } from '@blockstack/connect-react';
import { showBlockstackConnect, authenticate } from '@blockstack/connect';

export const Auth: React.FC = () => {
  // const { doOpenAuth } = useConnect();
  const { authOptions } = useConnect();
  console.log(authOptions);
  return (
    <Box>
      <Text display="block" textStyle="body.large">
        Sign in with your Blockstack account to try the demo
      </Text>
      <ButtonGroup spacing={space('base')} mt={space('base-loose')}>
        <Button
          size="lg"
          onClick={() =>
            authenticate({
              ...authOptions,
              sendToSignIn: true,
            })
          }
          data-test="sign-in"
        >
          Sign in
        </Button>
        <Button
          size="lg"
          mode="tertiary"
          onClick={() => showBlockstackConnect(authOptions)}
          data-test="sign-up"
        >
          Sign up
        </Button>
      </ButtonGroup>
    </Box>
  );
};
