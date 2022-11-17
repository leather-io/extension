import { memo } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { Box } from '@stacks/ui';

import { useWalletType } from '@app/common/use-wallet-type';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { useAccounts } from '@app/store/accounts/account.hooks';

import { RecipientAccountListItem } from './recipient-account-list-item';

const smallNumberOfAccountsToRenderWholeList = 10;

interface RecipientAccountDrawerProps {
  closeAccountsDrawer(): void;
  isShowing: boolean;
}

export const RecipientAccountDrawer = memo(
  ({ isShowing, closeAccountsDrawer }: RecipientAccountDrawerProps) => {
    const { whenWallet } = useWalletType();
    const accounts = useAccounts();

    return accounts && isShowing ? (
      <BaseDrawer title="My accounts" isShowing={isShowing} onClose={closeAccountsDrawer}>
        <Box mx={['base-loose', 'extra-loose']}>
          {accounts.length <= smallNumberOfAccountsToRenderWholeList ? (
            <Box mb={whenWallet({ ledger: 'base', software: '' })} marginBottom={8}>
              {accounts.map(item => (
                <RecipientAccountListItem
                  handleClose={closeAccountsDrawer}
                  account={item}
                  key={item.address}
                />
              ))}
            </Box>
          ) : (
            <Virtuoso
              height="72px"
              style={{ paddingTop: '24px', height: '70vh' }}
              totalCount={accounts.length}
              itemContent={index => (
                <RecipientAccountListItem
                  handleClose={closeAccountsDrawer}
                  account={accounts[index]}
                />
              )}
            />
          )}
        </Box>
      </BaseDrawer>
    ) : null;
  }
);
