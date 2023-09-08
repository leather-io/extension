import { FormEvent, useCallback, useState } from 'react';

// #4164 FIXME migrate Input - not sure if we even need it
import { Input } from '@stacks/ui';
import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Box, Stack } from 'leather-styles/jsx';
import { styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useKeyActions } from '@app/common/hooks/use-key-actions';
import { WaitingMessages, useWaitingMessage } from '@app/common/utils/use-waiting-message';
import { LeatherButton } from '@app/components/button/button';

import { ErrorLabel } from './error-label';
import { buildEnterKeyEvent } from './link';

const waitingMessages: WaitingMessages = {
  '2': 'Verifying password…',
  '10': 'Still working…',
  '20': 'Almost there',
};

interface RequestPasswordProps {
  onSuccess(): void;
  title?: string;
  caption?: string;
}
export function RequestPassword({ title, caption, onSuccess }: RequestPasswordProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { unlockWallet } = useKeyActions();
  const analytics = useAnalytics();
  const [isRunning, waitingMessage, startWaitingMessage, stopWaitingMessage] =
    useWaitingMessage(waitingMessages);

  const submit = useCallback(async () => {
    const startUnlockTimeMs = performance.now();
    void analytics.track('start_unlock');
    startWaitingMessage();
    setError('');
    try {
      await unlockWallet(password);
      onSuccess?.();
    } catch (error) {
      setError('The password you entered is invalid');
    }
    stopWaitingMessage();
    const unlockSuccessTimeMs = performance.now();
    void analytics.track('complete_unlock', {
      durationMs: unlockSuccessTimeMs - startUnlockTimeMs,
    });
  }, [analytics, startWaitingMessage, stopWaitingMessage, unlockWallet, password, onSuccess]);

  return (
    <>
      <styled.h1 textStyle="heading.02">{title}</styled.h1>
      <styled.p textStyle="body.02">{(isRunning && waitingMessage) || caption}</styled.p>
      <Stack gap="space.04">
        <Input
          autoFocus
          _focus={{ border: `2px solid ${token('colors.brown.12')}` }}
          borderRadius="10px"
          data-testid={SettingsSelectors.EnterPasswordInput}
          height="64px"
          isDisabled={isRunning}
          onChange={(e: FormEvent<HTMLInputElement>) => {
            setError('');
            setPassword(e.currentTarget.value);
          }}
          onKeyUp={buildEnterKeyEvent(submit)}
          placeholder="Enter your password"
          type="password"
          value={password}
          width="100%"
        />
        {error && (
          <Box>
            <ErrorLabel>
              <styled.span textStyle="caption">{error}</styled.span>
            </ErrorLabel>
          </Box>
        )}
      </Stack>
      <LeatherButton
        data-testid={SettingsSelectors.UnlockWalletBtn}
        disabled={isRunning || !!error}
        aria-busy={isRunning}
        onClick={submit}
      >
        Continue
      </LeatherButton>
    </>
  );
}
