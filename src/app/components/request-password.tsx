import { useState, useCallback, FormEvent } from 'react';
import { Box, color, Input, Stack } from '@stacks/ui';
import UnlockSession from '@assets/images/unlock-session.png';
import { Text } from '@app/components/typography';
import { PageTitle } from '@app/components/page-title';
import { useWaitingMessage, WaitingMessages } from '@app/common/utils/use-waiting-message';
import { useWallet } from '@app/common/hooks/use-wallet';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { SettingsSelectors } from '@tests/integration/settings.selectors';
import { buildEnterKeyEvent } from './link';
import { ErrorLabel } from './error-label';
import { PrimaryButton } from './primary-button';

const waitingMessages: WaitingMessages = {
  '2': 'Verifying password…',
  '10': 'Still working…',
  '20': 'Almost there.',
};

interface RequestPasswordProps {
  onSuccess: (password: string) => void;
  title?: string;
  caption?: string;
}

export function RequestPassword({ title, caption, onSuccess }: RequestPasswordProps): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { unlockWallet } = useWallet();
  const analytics = useAnalytics();
  const [waitingMessage, startWaitingMessage, stopWaitingMessage] =
    useWaitingMessage(waitingMessages);

  const submit = useCallback(async () => {
    const startUnlockTimeMs = performance.now();
    void analytics.track('start_unlock');
    setLoading(true);
    startWaitingMessage();
    setError('');

    try {
      await unlockWallet(password);
      onSuccess?.(password);
    } catch (error) {
      setError('The password you entered is invalid.');
    }
    setLoading(false);
    stopWaitingMessage();
    const unlockSuccessTimeMs = performance.now();
    void analytics.track('complete_unlock', {
      durationMs: unlockSuccessTimeMs - startUnlockTimeMs,
    });
  }, [startWaitingMessage, analytics, stopWaitingMessage, unlockWallet, password]);

  return (
    <>
      <Box alignSelf={['start', 'center']} mt={['base', 'unset']} width={['97px', '115px']}>
        <img src={UnlockSession} />
      </Box>
      <PageTitle fontSize={[4, 7]}>{title}</PageTitle>
      <Text color={color('text-caption')}>{waitingMessage || caption}</Text>
      <Stack spacing="base">
        <Input
          autoFocus
          borderRadius="10px"
          data-testid={SettingsSelectors.EnterPasswordInput}
          height="64px"
          isDisabled={loading}
          onChange={(e: FormEvent<HTMLInputElement>) => setPassword(e.currentTarget.value)}
          onKeyUp={buildEnterKeyEvent(submit)}
          placeholder="Enter your password"
          type="password"
          value={password}
          width="100%"
        />
        {error && (
          <Box>
            <ErrorLabel>
              <Text textStyle="caption">{error}</Text>
            </ErrorLabel>
          </Box>
        )}
      </Stack>
      <PrimaryButton
        data-testid={SettingsSelectors.UnlockWalletBtn}
        isDisabled={loading}
        isLoading={loading}
        onClick={submit}
      >
        Continue
      </PrimaryButton>
    </>
  );
}
