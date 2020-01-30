import React, { useState } from 'react';
import { wordlists } from 'bip39';

import { Box, Flex, Input, Text, Button } from '@blockstack/ui';
import { Screen, ScreenBody, ScreenActions } from '@blockstack/connect';
import { ScreenHeader } from '@components/connected-screen-header';

import { useAppDetails } from '@common/hooks/useAppDetails';
import { useDispatch, useSelector } from 'react-redux';
import { doSetUsername } from 'store/onboarding/actions';
import { selectCurrentWallet } from '@store/wallet/selectors';
import { AppState } from '@store';
import { DEFAULT_PASSWORD } from '@store/onboarding/types';
import { registerSubdomain, Subdomains } from '@blockstack/keychain';
import { didGenerateWallet } from '@store/wallet';
import Identity from '@blockstack/keychain/dist/identity';

interface UsernameProps {
  next: () => void;
  doFinishSignIn: (identity: Identity) => void;
}

const getRandomWord = () => {
  const list = wordlists.EN;
  const word = list[Math.floor(Math.random() * list.length)];
  return word;
};

export const Username: React.FC<UsernameProps> = ({ next, doFinishSignIn }) => {
  const [error, setError] = useState('');
  const [username, setUsername] = useState(
    () => `${getRandomWord()}-${getRandomWord()}-${getRandomWord()}-${getRandomWord()}`
  );
  const dispatch = useDispatch();
  const { wallet } = useSelector((state: AppState) => ({
    wallet: selectCurrentWallet(state),
  }));

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
          onClick={async () => {
            if (wallet) {
              const identity = await wallet.createNewIdentity(DEFAULT_PASSWORD);
              await registerSubdomain({
                username,
                subdomain: Subdomains.TEST,
                gaiaHubUrl: 'https://hub.blockstack.org',
                identity,
              });
              dispatch(didGenerateWallet(wallet));
              doFinishSignIn(identity);
              return;
            }

            dispatch(doSetUsername(username));
            next();
          }}
        >
          Continue
        </Button>
      </ScreenActions>
    </Screen>
  );
};
