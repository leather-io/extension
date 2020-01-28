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
  const [isValidUsername, setValidity] = useState(false);
  const [loading, setLoading] = useState(false);
  const { name } = useAppDetails();
  const handleInput = (evt: React.FormEvent<HTMLInputElement>) => {
    setError('');
    setUsername(evt.currentTarget.value || '');
    if (username.length > 8) {
      setValidity(true);
    }
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
            <Input paddingRight="100px" autoFocus placeholder="username" value={username} onChange={handleInput} />
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
          isDisabled={!isValidUsername}
          width="100%"
          isLoading={loading}
          onClick={async () => {
            setLoading(true);
            try {
              console.log('validate');
              setTimeout(() => {
                setLoading(false);
                next();
              }, 1500);
            } catch (e) {
              console.log(e);
              setLoading(false);
            }
          }}
        >
          Continue
        </Button>
      </ScreenActions>
    </Screen>
  );
};
