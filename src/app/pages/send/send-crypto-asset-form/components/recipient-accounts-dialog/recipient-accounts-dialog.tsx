import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Virtuoso } from 'react-virtuoso';

import { Box } from 'leather-styles/jsx';

import { useGetVirtuosoHeight } from '@app/common/hooks/use-get-virtuoso-height';
import { useFilteredBitcoinAccounts } from '@app/store/accounts/blockchain/bitcoin/bitcoin.ledger';
import { useStacksAccounts } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { Dialog } from '@app/ui/components/containers/dialog/dialog';
import { Header } from '@app/ui/components/containers/headers/header';

import { AccountListItem } from './account-list-item';

export function RecipientAccountsDialog() {
  const stacksAccounts = useStacksAccounts();
  const navigate = useNavigate();

  const onGoBack = useCallback(() => navigate('..', { replace: true }), [navigate]);
  const bitcoinAccounts = useFilteredBitcoinAccounts();
  const btcAddressesNum = bitcoinAccounts.length / 2;
  const stacksAddressesNum = stacksAccounts.length;

  const accountNum = stacksAddressesNum || btcAddressesNum;
  const virtuosoStyles = useGetVirtuosoHeight(accountNum, 'no-footer');
  if (stacksAddressesNum === 0 && btcAddressesNum === 0) return null;

  return (
    <Dialog
      header={<Header variant="dialog" title="My accounts" />}
      contentMaxHeight={virtuosoStyles.height}
      isShowing
      onClose={onGoBack}
    >
      <Virtuoso
        style={{
          ...virtuosoStyles,
          height: virtuosoStyles.height,
          marginBottom: virtuosoStyles.marginBottom,
        }}
        itemContent={index => (
          <Box key={index} my="space.05" px="space.05">
            <AccountListItem
              stacksAccount={stacksAccounts[index]}
              onClose={onGoBack}
              index={index}
            />
          </Box>
        )}
        totalCount={stacksAddressesNum || btcAddressesNum}
      />
    </Dialog>
  );
}
