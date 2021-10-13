import React from 'react';
import { Outlet } from 'react-router-dom';
import { Stack } from '@stacks/ui';

import { UserAccount } from '@pages/home/components/user-area';
import { HomeActions } from '@pages/home/components/home-actions';
import { HomePageSelectors } from '@tests/page-objects/home-page.selectors';
import { PopupContainer } from '@components/popup/container';
import { Header } from '@components/header';
import { HiroMessages } from '@features/hiro-messages/hiro-messages';
import { ActivityList } from '@features/activity-list/account-activity';
import { BalancesList } from '@features/balances-list/balances-list';
import { usePromptUserToSetDiagnosticPermissions } from '@common/hooks/use-diagnostic-permission-prompt';

import { HomeTabs } from './components/home-tabs';

export const Home = () => {
  usePromptUserToSetDiagnosticPermissions();

  return (
    <>
      <PopupContainer
        requestType="auth"
        header={
          <>
            <HiroMessages mx="tight" />
            <Header pt="base-tight" />
          </>
        }
      >
        <Stack data-testid="home-page" flexGrow={1} spacing="loose">
          <UserAccount />
          <HomeActions />
          <HomeTabs
            balances={<BalancesList data-testid={HomePageSelectors.BalancesList} />}
            activity={<ActivityList />}
          />
        </Stack>
      </PopupContainer>
      <Outlet />
    </>
  );
};
