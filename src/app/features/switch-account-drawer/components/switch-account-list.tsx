import { memo } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { Box } from 'leather-styles/jsx';

import { useWalletType } from '@app/common/use-wallet-type';

import { SwitchAccountListItem } from './switch-account-list-item';

interface SwitchAccountListProps {
  handleClose(): void;
  currentAccountIndex: number;
  addressesNum: number;
}
export const SwitchAccountList = memo(
  ({ currentAccountIndex, handleClose, addressesNum }: SwitchAccountListProps) => {
    const { whenWallet } = useWalletType();

    return (
      <Virtuoso
        initialTopMostItemIndex={whenWallet({ ledger: 0, software: currentAccountIndex })}
        height="72px"
        style={{ paddingTop: '24px', height: '70vh' }}
        totalCount={addressesNum}
        itemContent={index => (
          <Box mx={['space.05', 'space.06']} key={index}>
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
