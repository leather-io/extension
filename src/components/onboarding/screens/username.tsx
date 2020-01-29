import React, { useState } from 'react';

import { Box, Flex, Input, Text, Button } from '@blockstack/ui';
import { Screen, ScreenBody, ScreenActions } from '@blockstack/connect';
import { ScreenHeader } from '@components/connected-screen-header';

import { useAppDetails } from '@common/hooks/useAppDetails';

interface UsernameProps {
  next: () => void;
}

export const Username: React.FC<UsernameProps> = ({ next }) => {
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');

  const { name } = useAppDetails();
  const handleInput = (evt: React.FormEvent<HTMLInputElement>) => {
    setError('');
    setUsername(evt.currentTarget.value || '');
  };
  return (
    <Screen>
      <ScreenHeader />
      <ScreenBody
        title="Choose a username"
        body={[
          `This is how people will find you in ${name} and other apps you use with Data Vault.`,
          <Box textAlign="left" position="relative">
            <Flex color="ink.400" pr={4} align="center" height="100%" zIndex={99} position="absolute" right={0} top={0}>
              <Text pt={'2px'}>.blockstack.id</Text>
            </Flex>
            <Input
              data-test="input-username"
              paddingRight="100px"
              autoFocus
              placeholder="username"
              value={username}
              onChange={handleInput}
            />
            {error && (
              <Text textAlign="left" textStyle="caption" color="feedback.error">
                {error}
              </Text>
            )}
          </Box>,
        ]}
      />
      <ScreenActions>
        <Button
          width="100%"
          data-test="button-username-continue"
          onClick={() => {
            next();
          }}
        >
          Continue
        </Button>
      </ScreenActions>
    </Screen>
  );
};
