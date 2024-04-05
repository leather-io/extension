import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Virtuoso } from 'react-virtuoso';

import { Box } from 'leather-styles/jsx';

import { useFilteredBitcoinAccounts } from '@app/store/accounts/blockchain/bitcoin/bitcoin.ledger';
import { useStacksAccounts } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { Dialog, getHeightOffset } from '@app/ui/components/containers/dialog/dialog';
import { Header } from '@app/ui/components/containers/headers/header';
import { virtuosoHeight, virtuosoStyles } from '@app/ui/shared/virtuoso';

import { AccountListItem } from './account-list-item';

export function RecipientAccountsDialog() {
  const stacksAccounts = useStacksAccounts();
  const navigate = useNavigate();

  const onGoBack = useCallback(() => navigate('..', { replace: true }), [navigate]);
  const bitcoinAccounts = useFilteredBitcoinAccounts();
  const btcAddressesNum = bitcoinAccounts.length / 2;
  const stacksAddressesNum = stacksAccounts.length;

  if (stacksAddressesNum === 0 && btcAddressesNum === 0) return null;
  const accountNum = stacksAddressesNum || btcAddressesNum;
  const maxAccountsShown = accountNum > 10 ? 10 : accountNum;

  return (
    <Dialog header={<Header variant="dialog" title="My accounts" />} isShowing onClose={onGoBack}>
      <Virtuoso
        height={virtuosoHeight}
        style={{
          ...virtuosoStyles,
          height: `calc(${virtuosoHeight * maxAccountsShown}px + ${getHeightOffset(true, true)}px)`,
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
