import { FormEvent, useCallback, useState } from 'react';

import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Box, Stack, styled } from 'leather-styles/jsx';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useKeyActions } from '@app/common/hooks/use-key-actions';
import { buildEnterKeyEvent } from '@app/common/hooks/use-modifier-key';
import { WaitingMessages, useWaitingMessage } from '@app/common/utils/use-waiting-message';
import { LeatherButton } from '@app/components/button/button';

import { ErrorLabel } from './error-label';

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
    <Stack
      pb={['space.05', 'unset']}
      px={['space.05', 'space.04']}
      gap="space.05"
      textAlign={['center', 'center']}
      margin="auto"
    >
      <styled.h1 textStyle={['heading.03', 'heading.02']}>{title}</styled.h1>
      <styled.p textStyle="body.02">{(isRunning && waitingMessage) || caption}</styled.p>
      <Stack gap="space.04">
        <styled.input
          autoCapitalize="off"
          autoComplete="off"
          autoFocus
          _focus={{
            border: '2px solid',
            borderColor: 'accent.action-primary-default',
          }}
          border="active"
          borderRadius="10px"
          data-testid={SettingsSelectors.EnterPasswordInput}
          disabled={isRunning}
          height="64px"
          onChange={(e: FormEvent<HTMLInputElement>) => {
            setError('');
            setPassword(e.currentTarget.value);
          }}
          onKeyUp={buildEnterKeyEvent(submit)}
          p="space.04"
          placeholder="Enter your password"
          ring="none"
          type="password"
          textStyle="body.02"
          value={password}
          width="100%"
        />
        {error && (
          <Box>
            <ErrorLabel>
              <styled.span textStyle="body.02">{error}</styled.span>
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
    </Stack>
  );
}
