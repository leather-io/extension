import React from 'react';
import { Outlet } from 'react-router-dom';
import { Stack } from '@stacks/ui';
import { PopupContainer } from '@components/popup/container';
import { Header } from '@components/header';
import { BalancesAndActivity } from '@features/balances-and-activity';
import { UserAccount } from '@pages/home/components/user-area';
import { HomeActions } from '@pages/home/components/actions';
import { HiroMessages } from '@features/hiro-messages/hiro-messages';

export const PopupHome = () => {
  return (
    <>
      <PopupContainer
        header={
          <>
            <HiroMessages mx="tight" />
            <Header pt="base-tight" />
          </>
        }
        requestType="auth"
      >
        <Stack data-testid="home-page" flexGrow={1} spacing="loose">
          <UserAccount />
          <HomeActions />
          <BalancesAndActivity />
        </Stack>
      </PopupContainer>
      <Outlet />
    </>
  );
};
