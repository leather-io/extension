import { memo } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { Box } from 'leather-styles/jsx';

import { useWalletType } from '@app/common/use-wallet-type';
import { BtcAccount } from '@app/store/accounts/blockchain/bitcoin/bitcoin-accounts.hooks';
import { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';

import { SwitchAccountListItem } from './switch-account-list-item';

interface SwitchAccountListProps {
  handleClose: () => void;
  stacksAccounts: StacksAccount[];
  bitcoinAccounts: BtcAccount[];
  currentAccountIndex: number;
}
export const SwitchAccountList = memo(
  ({
    stacksAccounts,
    currentAccountIndex,
    handleClose,
    bitcoinAccounts,
  }: SwitchAccountListProps) => {
    const { whenWallet } = useWalletType();

    return (
      <Virtuoso
        initialTopMostItemIndex={whenWallet({ ledger: 0, software: currentAccountIndex })}
        height="72px"
        style={{ paddingTop: '24px', height: '70vh' }}
        totalCount={stacksAccounts.length || bitcoinAccounts.length}
        itemContent={index => (
          <Box
            mx={['space.05', 'space.06']}
            key={stacksAccounts[index]?.address ?? bitcoinAccounts[index]?.address ?? index}
          >
            <SwitchAccountListItem
              handleClose={handleClose}
              currentAccountIndex={currentAccountIndex}
              index={index}
            />
          </Box>
        )}
      />
    );
  }
);
