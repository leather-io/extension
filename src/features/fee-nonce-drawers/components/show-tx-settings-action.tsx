import { useDrawers } from '@common/hooks/use-drawers';
import { useTxByteSizeState, useTxForSettingsState } from '@store/transactions/transaction.hooks';
import { Caption } from '@components/typography';
import { color } from '@stacks/ui';
import React from 'react';
import { ConfirmTransferSelectors } from '@tests/page-objects/confirm-transfer-selectors';

export const ShowTxSettingsAction = () => {
  const { showTxSettings, setShowTxSettings } = useDrawers();
  const [tx] = useTxForSettingsState();
  const [, setTxBytes] = useTxByteSizeState();
  return (
    <Caption
      _hover={{ cursor: 'pointer', textDecoration: 'underline' }}
      color={color('brand')}
      onClick={() => {
        setShowTxSettings(!showTxSettings);
        setTxBytes(tx?.serialize().byteLength || null);
      }}
      data-testid={ConfirmTransferSelectors.BtnSettings}
    >
      Settings
    </Caption>
  );
};

export const ShowTxSettingsPlaceholder = () => (
  <Caption _hover={{ cursor: 'not-allowed' }} color={color('brand')}>
    Loading...
  </Caption>
);
