import { FormEvent, useCallback, useState } from 'react';

import { Input } from '@stacks/ui';
import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Stack, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useKeyActions } from '@app/common/hooks/use-key-actions';
import { WaitingMessages, useWaitingMessage } from '@app/common/utils/use-waiting-message';
import { LeatherButton } from '@app/components/button/button';

import { ErrorLabel } from './error-label';
import { buildEnterKeyEvent } from './link';
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
              <Input
                autoFocus
                _focus={{ border: `2px solid ${token('colors.accent.text-primary')}` }}
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
              {error && <ErrorLabel>{error}</ErrorLabel>}
            </Stack>
            <LeatherButton
              data-testid={SettingsSelectors.UnlockWalletBtn}
              disabled={isRunning || !!error}
              aria-busy={isRunning}
              onClick={submit}
              mt="space.08"
            >
              Continue
            </LeatherButton>
          </>
        }
      />
    </>
  );
}
