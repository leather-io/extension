import React, { useState, useCallback } from 'react';
import { useWallet } from '@common/hooks/use-wallet';
import { Box, Button, Text, Input } from '@stacks/ui';
import { PopupContainer } from '@components/popup/container';
import { buildEnterKeyEvent } from '@components/link';
import { ErrorLabel } from '@components/error-label';
import { Header } from '@components/header';
import { SignOutConfirmDrawer } from '@pages/sign-out-confirm/sign-out-confirm';
import { useDrawers } from '@common/hooks/use-drawers';

import { useLocation, useNavigate } from 'react-router-dom';

export const Unlock: React.FC = () => {
  const { doUnlockWallet } = useWallet();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { showSignOut } = useDrawers();

  const navigate = useNavigate();
  const { state } = useLocation();

  const submit = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      await doUnlockWallet(password);
      console.log('in unlock', state?.path);
      navigate(state?.path || '/');
    } catch (error) {
      setError('The password you entered is invalid.');
    }
    setLoading(false);
  }, [doUnlockWallet, password, navigate, state.path]);

  return (
    <>
      <PopupContainer header={<Header />} requestType="auth">
        <Box width="100%" mt="loose">
          <Text textStyle="body.large" display="block">
            Enter your password you used on this device to unlock your wallet.
          </Text>
        </Box>
        <Box mt="loose" width="100%">
          <Input
            placeholder="Enter your password."
            width="100%"
            autoFocus
            type="password"
            value={password}
            isDisabled={loading}
            data-testid="set-password"
            onChange={(e: React.FormEvent<HTMLInputElement>) => setPassword(e.currentTarget.value)}
            onKeyUp={buildEnterKeyEvent(submit)}
          />
        </Box>
        {error && (
          <Box>
            <ErrorLabel>
              <Text textStyle="caption">{error}</Text>
            </ErrorLabel>
          </Box>
        )}
        <Box flexGrow={1} />
        <Box>
          <Button
            width="100%"
            isLoading={loading}
            isDisabled={loading}
            onClick={submit}
            data-testid="set-password-done"
            borderRadius="10px"
          >
            Unlock
          </Button>
        </Box>
      </PopupContainer>
      {showSignOut && <SignOutConfirmDrawer />}
    </>
  );
};
