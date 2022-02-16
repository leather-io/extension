import { memo } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { AccountWithAddress } from '@app/store/accounts/account.models';
import { AccountListItem } from './account-list-item';

const smallNumberOfAccountsToRenderWholeList = 10;

interface AccountListProps {
  handleClose: () => void;
  accounts: AccountWithAddress[];
  currentAccountIndex: number;
}
export const AccountList = memo(
  ({ accounts, currentAccountIndex, handleClose }: AccountListProps) => {
    if (accounts.length <= smallNumberOfAccountsToRenderWholeList) {
      return (
        <>
          {accounts.map(account => (
            <AccountListItem handleClose={handleClose} account={account} key={account.address} />
          ))}
        </>
      );
    }

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
