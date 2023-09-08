import { memo } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { Box } from 'leather-styles/jsx';

import { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';

import { SwitchAccountListItem } from './switch-account-list-item';

interface SwitchAccountListProps {
  handleClose: () => void;
  accounts: StacksAccount[];
  currentAccountIndex: number;
}
export const SwitchAccountList = memo(
  ({ accounts, currentAccountIndex, handleClose }: SwitchAccountListProps) => {
    return (
      <Virtuoso
        initialTopMostItemIndex={currentAccountIndex}
        height="72px"
        style={{ paddingTop: '24px', height: '70vh' }}
        totalCount={accounts.length}
        itemContent={index => (
          <Box mx={['base-loose', 'space.06']} key={accounts[index].address ?? index}>
            <SwitchAccountListItem handleClose={handleClose} account={accounts[index]} />
          </Box>
        )}
      />
    );
  }
);
