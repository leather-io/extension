import React, { useCallback } from 'react';
import { ControlledDrawer } from '@components/drawer/controlled';
import { CreateAccount } from '@components/drawer/accounts/create-account';
import { AddUsername } from '@components/drawer/accounts/add-username';
import { useDrawers } from '@common/hooks/use-drawers';
import { SwitchAccounts } from '../account-switch-drawer/switch-accounts';

import { useShowAccountsStore, useUpdateAccountDrawerStep } from '@store/ui/ui.hooks';
import { AccountStep } from '@store/ui/ui.models';

export const AccountsDrawer: React.FC = () => {
  const { accountStep } = useDrawers();
  const [isShowing, setShowAccountStore] = useShowAccountsStore();
  const updateAccountDrawerStep = useUpdateAccountDrawerStep();

  const close = useCallback(() => {
    setShowAccountStore(false);
    const drawerAnimationTime = 200;
    setTimeout(() => updateAccountDrawerStep(AccountStep.Switch), drawerAnimationTime);
  }, [setShowAccountStore, updateAccountDrawerStep]);
  const getTitle = () => {
    switch (accountStep) {
      case AccountStep.Create:
        return 'Create account';
      case AccountStep.Switch:
        return 'Switch account';
      case AccountStep.Username:
        return 'Add a username';
    }
  };

  return (
    <ControlledDrawer title={getTitle()} isShowing={isShowing} onClose={close}>
      {accountStep === AccountStep.Switch && isShowing ? <SwitchAccounts close={close} /> : null}
      {accountStep === AccountStep.Create && isShowing ? <CreateAccount close={close} /> : null}
      {accountStep === AccountStep.Username && isShowing ? <AddUsername close={close} /> : null}
    </ControlledDrawer>
  );
};
