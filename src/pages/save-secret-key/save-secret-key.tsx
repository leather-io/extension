import React, { memo, useEffect } from 'react';
import { Stack } from '@stacks/ui';

import { useWallet } from '@common/hooks/use-wallet';
import { useChangeScreen } from '@common/hooks/use-change-screen';
import { RouteUrls } from '@routes/route-urls';
import { PopupContainer } from '@components/popup/container';
import { Header } from '@components/header';
import { useAnalytics } from '@common/hooks/analytics/use-analytics';

import { SecretKeyActions } from './components/secret-key-actions';
import { SecretKeyMessage } from './components/secret-key-message';
import { SecretKeyCard } from './components/secret-key-card';

export const SaveSecretKey: React.FC = memo(() => {
  const { hasSetPassword } = useWallet();
  const analytics = useAnalytics();
  const changeScreen = useChangeScreen();

  useEffect(() => {
    void analytics.page('view', '/save-your-secret-key');
  }, [analytics]);

  return (
    <PopupContainer
      header={
        <Header
          onClose={() => changeScreen(RouteUrls.Home)}
          hideActions={!hasSetPassword}
          title={hasSetPassword ? 'Your Secret Key' : 'Save your Secret Key'}
        />
      }
    >
      <Stack spacing="loose">
        <SecretKeyMessage />
        <SecretKeyCard />
        <SecretKeyActions />
      </Stack>
    </PopupContainer>
  );
});
