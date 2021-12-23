import { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@stacks/ui';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { useWallet } from '@app/common/hooks/use-wallet';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { Header } from '@app/components/header';
import { RouteUrls } from '@shared/route-urls';

import { SecretKeyActions } from './components/secret-key-actions';
import { SecretKeyMessage } from './components/secret-key-message';
import { SecretKeyCard } from './components/secret-key-card';

export const SaveSecretKey = memo(() => {
  const { secretKey } = useWallet();
  const analytics = useAnalytics();
  const navigate = useNavigate();

  useRouteHeader(<Header onClose={() => navigate(RouteUrls.Home)} title={'Your Secret Key'} />);

  useEffect(() => {
    if (!secretKey) navigate(RouteUrls.Onboarding);
  }, [navigate, secretKey]);

  useEffect(() => {
    void analytics.page('view', '/save-secret-key');
  }, [analytics]);

  return (
    <Stack spacing="loose">
      <SecretKeyMessage />
      <SecretKeyCard />
      <SecretKeyActions />
    </Stack>
  );
});
