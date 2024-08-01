import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { Flex, Stack, styled } from 'leather-styles/jsx';

import { LogomarkIcon } from '@leather.io/ui';

import { closeWindow } from '@shared/utils';

import { useCancelAuthRequest } from '@app/common/authentication/use-cancel-auth-request';
import { useAppDetails } from '@app/common/hooks/auth/use-app-details';
import { RequesterFlag } from '@app/components/requester-flag';
import { ChooseAccountsList } from '@app/pages/choose-account/components/accounts';
import { useOnOriginTabClose } from '@app/routes/hooks/use-on-tab-closed';
import { useStacksAccounts } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

export function ChooseAccount() {
  const { url } = useAppDetails();
  const accounts = useStacksAccounts();
  const hasConnectedStacksAccounts = accounts.length > 0;

  const cancelAuthentication = useCancelAuthRequest();

  useOnOriginTabClose(() => closeWindow());

  const handleUnmount = async () => cancelAuthentication();

  useEffect(() => {
    window.addEventListener('beforeunload', handleUnmount);
    return () => window.removeEventListener('beforeunload', handleUnmount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Flex alignItems="center" flexDirection="column" pt="space.07" width="100%">
        <Stack gap="space.05" textAlign="center" alignItems="center">
          {url && <RequesterFlag requester={url.toString()} />}
          <LogomarkIcon width="248px" height="58px" />
          <Stack gap="space.04">
            <styled.h1 textStyle="heading.05">
              {hasConnectedStacksAccounts
                ? 'Choose an account to connect'
                : 'No connected accounts found'}
            </styled.h1>
          </Stack>
        </Stack>
        {hasConnectedStacksAccounts && <ChooseAccountsList />}
      </Flex>
      <Outlet />
    </>
  );
}
