import React, { memo, useCallback, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Stack, Text } from '@stacks/ui';

import { useRouteHeader } from '@common/hooks/use-route-header';
import { Title } from '@components/typography';
import { AppIcon } from '@components/app-icon';
import { useWallet } from '@common/hooks/use-wallet';
import { useAppDetails } from '@common/hooks/auth/use-app-details';
import { Header } from '@components/header';
import { Accounts } from '@pages/choose-account/components/accounts';
import { RouteUrls } from '@routes/route-urls';

interface ChooseAccountProps {
  back?: () => void;
}
export const ChooseAccount: React.FC<ChooseAccountProps> = memo(() => {
  const { name: appName } = useAppDetails();
  const { wallet, cancelAuthentication } = useWallet();

  useRouteHeader(<Header hideActions />);

  const handleUnmount = useCallback(async () => {
    cancelAuthentication();
  }, [cancelAuthentication]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleUnmount);
    return () => window.removeEventListener('beforeunload', handleUnmount);
  }, [handleUnmount]);

  if (!wallet) return <Navigate to={RouteUrls.Onboarding} />;

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
