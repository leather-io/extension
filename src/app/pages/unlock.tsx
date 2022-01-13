import { useState, useCallback, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, color, Input, Stack } from '@stacks/ui';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { useWallet } from '@app/common/hooks/use-wallet';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { buildEnterKeyEvent } from '@app/components/link';
import { ErrorLabel } from '@app/components/error-label';
import { Header } from '@app/components/header';
import { CenteredPageContainer } from '@app/components/centered-page-container';
import { PrimaryButton } from '@app/components/primary-button';
import { PageTitle } from '@app/components/page-title';
import { SignOutConfirmDrawer } from '@app/pages/sign-out-confirm/sign-out-confirm';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { Text } from '@app/components/typography';
import { useWaitingMessage, WaitingMessages } from '@app/common/utils/use-waiting-message';
import { CENTERED_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';
import UnlockSession from '@assets/images/unlock-session.png';
import { RouteUrls } from '@shared/route-urls';
import { SettingsSelectors } from '@tests/integration/settings.selectors';

const waitingMessages: WaitingMessages = {
  '2': 'Please wait a few seconds…',
  '10': 'Still working, please wait.',
  '20': 'Almost there.',
};

export function Unlock(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { unlockWallet } = useWallet();
  const { decodedAuthRequest } = useOnboardingState();
  const { showSignOut } = useDrawers();
  const analytics = useAnalytics();
  const navigate = useNavigate();
  const [waitingMessage, startWaitingMessage, stopWaitingMessage] =
    useWaitingMessage(waitingMessages);

  useRouteHeader(<Header />);

  const submit = useCallback(async () => {
    const startUnlockTimeMs = performance.now();
    void analytics.track('start_unlock');
    setLoading(true);
    startWaitingMessage();
    setError('');

    try {
      await unlockWallet(password);

      if (decodedAuthRequest) {
        navigate(RouteUrls.ChooseAccount);
      } else {
        navigate(RouteUrls.Home);
      }
    } catch (error) {
      setError('The password you entered is invalid.');
    }
    setLoading(false);
    stopWaitingMessage();
    const unlockSuccessTimeMs = performance.now();
    void analytics.track('complete_unlock', {
      durationMs: unlockSuccessTimeMs - startUnlockTimeMs,
    });
  }, [
    startWaitingMessage,
    analytics,
    stopWaitingMessage,
    unlockWallet,
    password,
    decodedAuthRequest,
    navigate,
  ]);

  return (
    <CenteredPageContainer>
      <Stack
        maxWidth={CENTERED_FULL_PAGE_MAX_WIDTH}
        px={['loose', 'base-loose']}
        spacing="loose"
        textAlign={['left', 'center']}
        width="100%"
      >
        <Box alignSelf={['start', 'center']} mt={['base', 'unset']} width={['97px', '115px']}>
          <img src={UnlockSession} />
        </Box>
        <PageTitle fontSize={[4, 7]}>Your session is locked</PageTitle>
        <Text color={color('text-caption')}>
          {waitingMessage ||
            'Enter the password you previously set to access your accounts on this device'}
        </Text>
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
        {/* TODO: Add this back when check for matching secret key is ready */}
        {/* <Caption textAlign="left">
          Forgot your password? Unlock your account by{' '}
          <Link display="inline" fontSize={-1} onClick={() => navigate(RouteUrls.SignIn)}>
            entering your Secret Key.
          </Link>
        </Caption> */}
        {showSignOut && <SignOutConfirmDrawer />}
      </Stack>
    </CenteredPageContainer>
  );
}
