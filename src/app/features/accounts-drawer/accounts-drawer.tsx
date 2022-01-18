import { useCallback } from 'react';
import { ControlledDrawer } from '@app/components/drawer/controlled';
import { CreateAccount } from '@app/components/drawer/accounts/create-account';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { SwitchAccounts } from '../account-switch-drawer/switch-accounts';

import { useShowAccountsStore, useUpdateAccountDrawerStep } from '@app/store/ui/ui.hooks';
import { AccountStep } from '@app/store/ui/ui.models';

function getTitle(accountStep: AccountStep) {
  switch (accountStep) {
    case AccountStep.Create:
      return 'Create account';
    case AccountStep.Switch:
      return 'Switch account';
  }
}

export const AccountsDrawer = () => {
  const { accountStep } = useDrawers();
  const [isShowing, setShowAccountStore] = useShowAccountsStore();
  const updateAccountDrawerStep = useUpdateAccountDrawerStep();

  const close = useCallback(() => {
    setShowAccountStore(false);
    const drawerAnimationTime = 200;
    setTimeout(() => updateAccountDrawerStep(AccountStep.Switch), drawerAnimationTime);
  }, [setShowAccountStore, updateAccountDrawerStep]);

  return (
    <ControlledDrawer title={getTitle(accountStep)} isShowing={isShowing} onClose={close}>
      {accountStep === AccountStep.Switch && isShowing ? <SwitchAccounts close={close} /> : null}
      {accountStep === AccountStep.Create && isShowing ? <CreateAccount close={close} /> : null}
    </ControlledDrawer>
  );
};
