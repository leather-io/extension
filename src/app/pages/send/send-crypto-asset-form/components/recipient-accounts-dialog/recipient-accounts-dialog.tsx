import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Virtuoso } from 'react-virtuoso';

import { css } from 'leather-styles/css';

import { useFilteredBitcoinAccounts } from '@app/store/accounts/blockchain/bitcoin/bitcoin.ledger';
import { useStacksAccounts } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { Dialog } from '@app/ui/components/containers/dialog/dialog';

import { AccountListItem } from './account-list-item';

export const RecipientAccountsDialog = memo(() => {
  const stacksAccounts = useStacksAccounts();
  const navigate = useNavigate();

  const onGoBack = useCallback(() => navigate('..', { replace: true }), [navigate]);
  const bitcoinAccounts = useFilteredBitcoinAccounts();
  const btcAddressesNum = bitcoinAccounts.length / 2;
  const stacksAddressesNum = stacksAccounts.length;

  if (stacksAddressesNum === 0 && btcAddressesNum === 0) return null;
  return (
    <Dialog title="My accounts" isShowing onClose={onGoBack}>
      <Virtuoso
        className={css({
          marginX: 'space.05',
        })}
        useWindowScroll
        itemContent={index => (
          <AccountListItem
            key={index}
            stacksAccount={stacksAccounts[index]}
            onClose={onGoBack}
            index={index}
          />
        )}
        totalCount={stacksAddressesNum || btcAddressesNum}
      />
    </Dialog>
  );
});
