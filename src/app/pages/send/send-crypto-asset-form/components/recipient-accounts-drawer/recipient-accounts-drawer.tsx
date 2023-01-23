import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Virtuoso } from 'react-virtuoso';

import { Box } from '@stacks/ui';

import { useWalletType } from '@app/common/use-wallet-type';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { useAccounts } from '@app/store/accounts/account.hooks';

import { useStacksFtParams } from '../../form/stacks-sip10/use-stacks-ft-params';
import { AccountListItem } from './account-list-item';

const smallNumberOfAccountsToRenderWholeList = 10;

export const RecipientAccountsDrawer = memo(() => {
  const { contractId } = useStacksFtParams();
  const { whenWallet } = useWalletType();
  const accounts = useAccounts();
  const navigate = useNavigate();

  const onGoBack = useCallback(
    () => navigate('..', { state: { contractId } }),
    [contractId, navigate]
  );

  return accounts ? (
    <BaseDrawer title="My accounts" isShowing onClose={onGoBack}>
      <Box mx={['base-loose', 'extra-loose']}>
        {accounts.length <= smallNumberOfAccountsToRenderWholeList ? (
          <Box marginBottom={8} mb={whenWallet({ ledger: 'base', software: '' })}>
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
  ) : null;
});
