import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Virtuoso } from 'react-virtuoso';

import { Box } from '@stacks/ui';

import { useWalletType } from '@app/common/use-wallet-type';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import {
  useCurrentStacksAccount,
  useStacksAccounts,
} from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { AccountListItem } from './account-list-item';

const smallNumberOfAccountsToRenderWholeList = 10;

export const RecipientAccountsDrawer = memo(() => {
  const { whenWallet } = useWalletType();
  const accounts = useStacksAccounts();
  const currentAccount = useCurrentStacksAccount();
  const navigate = useNavigate();

  const onGoBack = useCallback(() => navigate('..', { replace: true }), [navigate]);

  if (!accounts) return null;

  const accountsExcludingCurrentAccount = accounts.filter(
    acc => acc?.index !== currentAccount?.index
  );

  return (
    <BaseDrawer title="My accounts" isShowing onClose={onGoBack}>
      <Box mb="loose" mx={['base-loose', 'extra-loose']}>
        {accountsExcludingCurrentAccount.length <= smallNumberOfAccountsToRenderWholeList ? (
          <Box marginBottom={8} mb={whenWallet({ ledger: 'base', software: '' })}>
            {accountsExcludingCurrentAccount.map(item => (
              <AccountListItem account={item} key={item.address} onClose={onGoBack} />
            ))}
          </Box>
        ) : (
          <Virtuoso
            height="72px"
            itemContent={index => (
              <AccountListItem
                account={accountsExcludingCurrentAccount[index]}
                onClose={onGoBack}
              />
            )}
            style={{ paddingTop: '24px', height: '70vh' }}
            totalCount={accountsExcludingCurrentAccount.length}
          />
        )}
      </Box>
    </BaseDrawer>
  );
});
