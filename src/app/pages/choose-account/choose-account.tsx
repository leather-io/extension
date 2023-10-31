import { memo, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { Flex, Stack, styled } from 'leather-styles/jsx';

import { closeWindow } from '@shared/utils';

import { useCancelAuthRequest } from '@app/common/authentication/use-cancel-auth-request';
import { useAppDetails } from '@app/common/hooks/auth/use-app-details';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { RequesterFlag } from '@app/components/requester-flag';
import { ChooseAccountsList } from '@app/pages/choose-account/components/accounts';
import { useOnOriginTabClose } from '@app/routes/hooks/use-on-tab-closed';
import { LeatherIcon } from '@app/ui/components/icons/leather-icon';

export const ChooseAccount = memo(() => {
  const { url } = useAppDetails();

  const cancelAuthentication = useCancelAuthRequest();

  useRouteHeader(<></>);
  useOnOriginTabClose(() => closeWindow());

  const handleUnmount = async () => cancelAuthentication();

  useEffect(() => {
    window.addEventListener('beforeunload', handleUnmount);
    return () => window.removeEventListener('beforeunload', handleUnmount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Flex alignItems="center" flexDirection="column" px="space.06" pt="space.07" width="100%">
        <Stack gap="space.05" textAlign="center" alignItems="center">
          {url && <RequesterFlag requester={url.toString()} />}
          <LeatherIcon width="248px" height="58px" />
          <Stack gap="space.04">
            <styled.h1 textStyle="heading.05">Choose an account to connect</styled.h1>
          </Stack>
        </Stack>
        <ChooseAccountsList />
      </Flex>
      <Outlet />
    </>
  );
});
