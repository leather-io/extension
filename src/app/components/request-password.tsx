import { FormEvent, useCallback, useState } from 'react';

import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { styled } from 'leather-styles/jsx';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useKeyActions } from '@app/common/hooks/use-key-actions';
import { buildEnterKeyEvent } from '@app/common/hooks/use-modifier-key';
import { Button } from '@app/ui/components/button/button';
import { Footer } from '@app/ui/components/containers/footers/footer';
import { Card } from '@app/ui/layout/card/card';
import { Page } from '@app/ui/layout/page/page.layout';

import { ErrorLabel } from './error-label';

interface RequestPasswordProps {
  onSuccess(): void;
}
export function RequestPassword({ onSuccess }: RequestPasswordProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { unlockWallet } = useKeyActions();
  const analytics = useAnalytics();
  const submit = useCallback(async () => {
    const startUnlockTimeMs = performance.now();
    void analytics.track('start_unlock');
    setError('');
    try {
      await unlockWallet(password);
      onSuccess?.();
    } catch (error) {
      setError('The password you entered is invalid');
    }
    const unlockSuccessTimeMs = performance.now();
    void analytics.track('complete_unlock', {
      durationMs: unlockSuccessTimeMs - startUnlockTimeMs,
    });
  }, [analytics, unlockWallet, password, onSuccess]);

  return (
    <Page showLogo>
      <Card
        title={<styled.h3 textStyle="heading.03">Enter your password</styled.h3>}
        text="Your password is used to secure your Secret Key and is only used locally on your device."
        action={
          <Footer variant="card">
            <Button
              data-testid={SettingsSelectors.UnlockWalletBtn}
              disabled={!!error}
              onClick={submit}
              variant="solid"
            >
              Continue
            </Button>
          </Footer>
        }
      >
        <styled.input
          _focus={{ border: 'focus' }}
          autoCapitalize="off"
          autoComplete="off"
          autoFocus
          border="active"
          borderRadius="sm"
          data-testid={SettingsSelectors.EnterPasswordInput}
          height="inputHeight"
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
        {error && <ErrorLabel width="100%">{error}</ErrorLabel>}

        {/*  TODO: #4735 implement forgot password flow */}
        {/* <Link>
          Forgot password?
        </Link> */}
      </Card>
    </Page>
  );
}
