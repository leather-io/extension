import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Virtuoso } from 'react-virtuoso';

import { Box } from 'leather-styles/jsx';

import { Sheet, SheetHeader } from '@leather.io/ui';

import { useFilteredBitcoinAccounts } from '@app/store/accounts/blockchain/bitcoin/bitcoin.ledger';
import { useStacksAccounts } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { VirtuosoWrapperSheet } from '@app/ui/components/virtuoso-wrapper-sheet';

import { AccountListItem } from './account-list-item';

export function RecipientAccountsSheet() {
  const stacksAccounts = useStacksAccounts();
  const navigate = useNavigate();

  const onGoBack = useCallback(() => navigate('..', { replace: true }), [navigate]);
  const bitcoinAccounts = useFilteredBitcoinAccounts();
  const btcAddressesNum = bitcoinAccounts.length / 2;
  const stacksAddressesNum = stacksAccounts.length;

  if (stacksAddressesNum === 0 && btcAddressesNum === 0) return null;
  const accountNum = stacksAddressesNum || btcAddressesNum;

  return (
    <Sheet
      header={<SheetHeader title="My accounts" />}
      isShowing
      onClose={onGoBack}
      wrapChildren={false}
    >
      <VirtuosoWrapperSheet>
        <Virtuoso
          itemContent={index => (
            <Box key={index} py="space.03" px="space.05">
              <AccountListItem
                stacksAccount={stacksAccounts[index]}
                onClose={onGoBack}
                index={index}
              />
            </Box>
          )}
          totalCount={accountNum}
        />
      </VirtuosoWrapperSheet>
    </Sheet>
  );
}
