import BigNumber from 'bignumber.js';

import { CryptoAssetItemLayout } from '@app/components/crypto-assets/crypto-asset-item/crypto-asset-item.layout';
import { createStacksCryptoCurrencyAssetTypeWrapper } from '@app/query/stacks/balance/stacks-ft-balances.utils';
import { StxAvatarIcon } from '@app/ui/components/avatar/stx-avatar-icon';

import { ConnectLedgerAssetBtn } from './connect-ledger-asset-button';

export function AddStacksLedgerKeysItem() {
  return (
    <CryptoAssetItemLayout
      assetBalance={createStacksCryptoCurrencyAssetTypeWrapper(new BigNumber(0))}
      icon={<StxAvatarIcon />}
      rightElement={<ConnectLedgerAssetBtn chain="stacks" />}
    />
  );
}
