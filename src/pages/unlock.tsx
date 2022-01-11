import React, { useState, useCallback } from 'react';
import { useWallet } from '@common/hooks/use-wallet';
import { Box, Button, Text, Input } from '@stacks/ui';
import { PopupContainer } from '@components/popup/container';
import { buildEnterKeyEvent } from '@components/link';
import { ErrorLabel } from '@components/error-label';
import { Header } from '@components/header';
import { SignOutConfirmDrawer } from '@pages/sign-out-confirm/sign-out-confirm';
import { useDrawers } from '@common/hooks/use-drawers';
import { useAnalytics } from '@common/hooks/analytics/use-analytics';

export const Unlock: React.FC = () => {
  const { unlockWallet } = useWallet();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { showSignOut } = useDrawers();
  const analytics = useAnalytics();

  const submit = useCallback(async () => {
    const startUnlockTimeMs = performance.now();
    void analytics.track('start_unlock');
    setLoading(true);
    setError('');
    try {
      await unlockWallet(password);
    } catch (error) {
      setError('The password you entered is invalid.');
    }
    setLoading(false);
    const unlockSuccessTimeMs = performance.now();
    void analytics.track('complete_unlock', {
      durationMs: unlockSuccessTimeMs - startUnlockTimeMs,
    });
  }, [analytics, unlockWallet, password]);

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
            placeholder="Enter your password"
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
