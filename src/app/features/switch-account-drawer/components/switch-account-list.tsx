import { memo } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { AccountWithAddress } from '@app/store/accounts/account.models';
import { SwitchAccountListItem } from './switch-account-list-item';

const smallNumberOfAccountsToRenderWholeList = 10;

interface SwitchAccountListProps {
  handleClose: () => void;
  accounts: AccountWithAddress[];
  currentAccountIndex: number;
}
export const SwitchAccountList = memo(
  ({ accounts, currentAccountIndex, handleClose }: SwitchAccountListProps) => {
    if (accounts.length <= smallNumberOfAccountsToRenderWholeList) {
      return (
        <>
          {accounts.map(account => (
            <SwitchAccountListItem
              handleClose={handleClose}
              account={account}
              key={account.address}
            />
          ))}
        </>
      );
    }

    return (
      <Virtuoso
        initialTopMostItemIndex={currentAccountIndex}
        height="72px"
        style={{ height: '70vh' }}
        totalCount={accounts.length}
        itemContent={index => (
          <SwitchAccountListItem handleClose={handleClose} account={accounts[index]} />
        )}
      />
    );
  }
);
