import { memo, useCallback, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Stack, Text } from '@stacks/ui';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { Title } from '@app/components/typography';
import { AppIcon } from '@app/components/app-icon';
import { useWallet } from '@app/common/hooks/use-wallet';
import { useAppDetails } from '@app/common/hooks/auth/use-app-details';
import { Header } from '@app/components/header';
import { Accounts } from '@app/pages/choose-account/components/accounts';
import { RouteUrls } from '@shared/route-urls';

export const ChooseAccount = memo(() => {
  const { name: appName } = useAppDetails();
  const { hasGeneratedWallet, cancelAuthentication, encryptedSecretKey } = useWallet();

  useRouteHeader(<Header hideActions />);

  const handleUnmount = useCallback(async () => {
    cancelAuthentication();
  }, [cancelAuthentication]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleUnmount);
    return () => window.removeEventListener('beforeunload', handleUnmount);
  }, [handleUnmount]);

  // Keeps routing in sync b/w view modes
  if (!hasGeneratedWallet && encryptedSecretKey) return <Navigate to={RouteUrls.Unlock} />;
  if (!hasGeneratedWallet) return <Navigate to={RouteUrls.Onboarding} />;

  return (
    <Stack spacing="loose" textAlign="center">
      <AppIcon mt="extra-loose" mb="loose" size="72px" />
      <Stack spacing="base">
        <Title fontSize={4}>Choose an account</Title>
        <Text textStyle="caption">to connect to {appName}</Text>
      </Stack>
      <Accounts mt="base" />
    </Stack>
  );
});
