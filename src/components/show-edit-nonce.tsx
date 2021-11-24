import React from 'react';
import { color } from '@stacks/ui';

import { useCurrentNetwork } from '@common/hooks/use-current-network';
import { useDrawers } from '@common/hooks/use-drawers';
import { SpaceBetween } from '@components/space-between';
import { Caption } from '@components/typography';
import {
  useTxByteSizeState,
  useUnsignedTxForSettingsState,
} from '@store/transactions/transaction.hooks';

export function ShowEditNonceAction(): JSX.Element {
  const { isTestnet, name } = useCurrentNetwork();
  const { showEditNonce, setShowEditNonce } = useDrawers();
  const [tx] = useUnsignedTxForSettingsState();
  const [, setTxBytes] = useTxByteSizeState();

  return (
    <SpaceBetween>
      <Caption
        _hover={{ cursor: 'pointer', textDecoration: 'underline' }}
        color={color('brand')}
        onClick={() => {
          setShowEditNonce(!showEditNonce);
          setTxBytes(tx?.serialize().byteLength || null);
        }}
      >
        Edit nonce
      </Caption>
      <Caption color="currentColor">{isTestnet ? name : 'Mainnet'}</Caption>
    </SpaceBetween>
  );
}

export function ShowEditNoncePlaceholder(): JSX.Element {
  return (
    <Caption _hover={{ cursor: 'not-allowed' }} color={color('brand')}>
      Loading...
    </Caption>
  );
}
