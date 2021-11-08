import React from 'react';
import { Outlet } from 'react-router-dom';
import { Button, Stack } from '@stacks/ui';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import StacksApp from '@zondax/ledger-blockstack';
import { toast } from 'react-hot-toast';

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
import { AddressVersion } from '@stacks/transactions';
import { logger } from '@common/logger';

export const Home = () => {
  usePromptUserToSetDiagnosticPermissions();

  const STX_DERIVATION_PATH = `m/44'/5757'/0'/0/0` as const;

  const handleLedger = async () => {
    try {
      const transport = await TransportWebUSB.create();
      transport.setDebugMode();
      const app = new StacksApp(transport);
      const resp = await app.showAddressAndPubKey(
        STX_DERIVATION_PATH,
        AddressVersion.MainnetSingleSig
      );
      logger.info(resp);
      if ('errorMessage' in resp && resp.errorMessage !== 'No errors') {
        toast.error(resp.errorMessage);
        return;
      }
      toast.success('it worked, addres ' + resp.address);
    } catch (e) {
      logger.debug(e);
    }
  };

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
          <p>
            When connected, with Stacks app open, this should prompt the device to show you your
            mainnet STX address. The browser should prompt you to connect your device via WebUSB.
          </p>
          <Button onClick={handleLedger}>Get Ledger address</Button>
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
