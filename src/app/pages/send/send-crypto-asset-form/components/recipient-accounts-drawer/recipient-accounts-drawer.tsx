import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Virtuoso } from 'react-virtuoso';

import { Box } from 'leather-styles/jsx';

import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { useFilteredBitcoinAccounts } from '@app/store/accounts/blockchain/bitcoin/bitcoin.ledger';
import { useStacksAccounts } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { AccountListItem } from './account-list-item';

export const RecipientAccountsDrawer = memo(() => {
  const stacksAccounts = useStacksAccounts();
  const navigate = useNavigate();

  const onGoBack = useCallback(() => navigate('..', { replace: true }), [navigate]);
  const bitcoinAccounts = useFilteredBitcoinAccounts();
  const btcAddressesNum = bitcoinAccounts.length / 2;
  const stacksAddressesNum = stacksAccounts.length;

  if (stacksAddressesNum === 0 && btcAddressesNum === 0) return null;

  return (
    <BaseDrawer title="My accounts" isShowing onClose={onGoBack}>
      <Box mb="space.05" mx="space.04">
        <Virtuoso
          height="72px"
          itemContent={index => (
            <AccountListItem
              key={index}
              stacksAccount={stacksAccounts[index]}
              onClose={onGoBack}
              index={index}
            />
          )}
          style={{ paddingTop: '24px', height: '70vh' }}
          totalCount={stacksAddressesNum || btcAddressesNum}
        />
      </Box>
    </BaseDrawer>
  );
});
