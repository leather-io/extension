import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Virtuoso } from 'react-virtuoso';

import { Box } from 'leather-styles/jsx';

import { useWalletType } from '@app/common/use-wallet-type';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { useStacksAccounts } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { AccountListItem } from './account-list-item';

const smallNumberOfAccountsToRenderWholeList = 10;

export const RecipientAccountsDrawer = memo(() => {
  const { whenWallet } = useWalletType();
  const accounts = useStacksAccounts();
  const navigate = useNavigate();

  const onGoBack = useCallback(() => navigate('..', { replace: true }), [navigate]);

  if (!accounts) return null;

  return (
    <BaseDrawer title="My accounts" isShowing onClose={onGoBack}>
      <Box mb="space.05" mx={['base-loose', 'space.06']}>
        {accounts.length <= smallNumberOfAccountsToRenderWholeList ? (
          <Box marginBottom={8} mb={whenWallet({ ledger: 'space.04', software: '' })}>
            {accounts.map(item => (
              <AccountListItem account={item} key={item.address} onClose={onGoBack} />
            ))}
          </Box>
        ) : (
          <Virtuoso
            height="72px"
            itemContent={index => <AccountListItem account={accounts[index]} onClose={onGoBack} />}
            style={{ paddingTop: '24px', height: '70vh' }}
            totalCount={accounts.length}
          />
        )}
      </Box>
    </BaseDrawer>
  );
});
