import { memo } from 'react';

import { Box } from '@stacks/ui';

import { useWalletType } from '@app/common/use-wallet-type';
import { ControlledDrawer } from '@app/components/drawer/controlled-drawer';
import { useAccounts } from '@app/store/accounts/account.hooks';

import { RecipientAccountListItem } from './recipient-account-list-item';

interface RecipientAccountDrawerProps {
  closeAccountsDrawer(): void;
  isShowing: boolean;
}

export const RecipientAccountDrawer = memo(
  ({ isShowing, closeAccountsDrawer }: RecipientAccountDrawerProps) => {
    const { whenWallet } = useWalletType();
    const accounts = useAccounts();

    return accounts ? (
      <ControlledDrawer title="My accounts" isShowing={isShowing} onClose={closeAccountsDrawer}>
        <Box mb={whenWallet({ ledger: 'base', software: '' })} marginBottom={8}>
          {accounts.map(item => (
            <Box mx={['base-loose', 'extra-loose']}>
              <RecipientAccountListItem
                handleClose={closeAccountsDrawer}
                account={item}
                key={item.address}
              />
            </Box>
          ))}
        </Box>
      </ControlledDrawer>
    ) : null;
  }
);
