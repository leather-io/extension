import React, { memo } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { AccountWithAddress } from '@store/accounts/account.models';
import { AccountListItem } from './account-list-item';

interface AccountListProps {
  handleClose: () => void;
  accounts: AccountWithAddress[];
  currentAccountIndex: number;
}
export const AccountList = memo(
  ({ accounts, currentAccountIndex, handleClose }: AccountListProps) => {
    return (
      <Virtuoso
        initialTopMostItemIndex={currentAccountIndex}
        style={{ height: '70vh' }}
        totalCount={accounts.length}
        itemContent={index => (
          <AccountListItem handleClose={handleClose} account={accounts[index]} />
        )}
      />
    );
  }
);
