import { color } from '@stacks/ui';

import { useCurrentNetwork } from '@app/common/hooks/use-current-network';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { SpaceBetween } from '@app/components/space-between';
import { Caption } from '@app/components/typography';
import {
  useTxByteSizeState,
  useUnsignedTxForSettingsState,
} from '@app/store/transactions/transaction.hooks';

export function ShowEditNonceAction(): JSX.Element {
  const { isTestnet, name } = useCurrentNetwork();
  const { showEditNonce, setShowEditNonce } = useDrawers();
  const tx = useUnsignedTxForSettingsState();
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
