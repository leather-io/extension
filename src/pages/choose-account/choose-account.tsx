import React, { memo, useCallback, useEffect } from 'react';
import { Title } from '@components/typography';
import { Accounts } from '@pages/choose-account/components/accounts';
import { AppIcon } from '@components/app-icon';
import { RouteUrls } from '@routes/route-urls';
import { useWallet } from '@common/hooks/use-wallet';
import { Navigate } from '@components/navigate';
import { Header } from '@components/header';
import { useAppDetails } from '@common/hooks/auth/use-app-details';
import { Box, Stack, Text } from '@stacks/ui';

interface ChooseAccountProps {
  back?: () => void;
}

export const ChooseAccount: React.FC<ChooseAccountProps> = memo(() => {
  const { name: appName } = useAppDetails();
  const { wallet, cancelAuthentication } = useWallet();

  const handleUnmount = useCallback(async () => {
    cancelAuthentication();
  }, [cancelAuthentication]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleUnmount);
    return () => window.removeEventListener('beforeunload', handleUnmount);
  }, [handleUnmount]);

  if (!wallet) {
    return <Navigate to={{ pathname: '/', hash: 'sign-up' }} screenPath={RouteUrls.SignUp} />;
  }

  return (
    <Box textAlign="center" flexGrow={1} position="relative">
      <Header hideActions />
      <AppIcon mt="extra-loose" mb="loose" size="72px" />
      <Stack spacing="base">
        <Title fontSize={4}>Choose an account</Title>
        <Text textStyle="caption">to connect to {appName}</Text>
      </Stack>
      <Accounts mt="base" />
    </Box>
  );
});
