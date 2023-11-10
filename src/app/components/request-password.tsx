import { FormEvent, useCallback, useState } from 'react';

import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Stack, styled } from 'leather-styles/jsx';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useKeyActions } from '@app/common/hooks/use-key-actions';
import { buildEnterKeyEvent } from '@app/common/hooks/use-modifier-key';
import { WaitingMessages, useWaitingMessage } from '@app/common/utils/use-waiting-message';
import { LeatherButton } from '@app/ui/components/button';

import { ErrorLabel } from './error-label';
import { TwoColumnLayout } from './secret-key/two-column.layout';

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
      <TwoColumnLayout
        leftColumn={
          <>
            <styled.h1
              textStyle={['heading.03', 'heading.03', 'heading.03', 'display.02']}
              mt="space.00"
              mb="space.06"
            >
              {title}
            </styled.h1>
            <styled.p textStyle={['label.01', 'heading.05']} mb="space.06">
              {(isRunning && waitingMessage) || caption}
            </styled.p>
          </>
        }
        rightColumn={
          <>
            <styled.h2
              textStyle="heading.03"
              mt="space.02"
              mb="space.04"
              hideBelow="sm"
              textAlign="center"
            >
              Your password
            </styled.h2>
            <Stack gap="space.04" alignItems="center">
              <styled.input
                _focus={{ border: 'focus' }}
                autoCapitalize="off"
                autoComplete="off"
                autoFocus
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
              {error && <ErrorLabel>{error}</ErrorLabel>}
            </Stack>
            <LeatherButton
              data-testid={SettingsSelectors.UnlockWalletBtn}
              disabled={isRunning || !!error}
              aria-busy={isRunning}
              onClick={submit}
              mt="space.05"
            >
              Continue
            </LeatherButton>
          </>
        }
      />
    </>
  );
}
