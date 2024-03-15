import BigNumber from 'bignumber.js';

import { CryptoCurrencyAssetItemLayout } from '@app/components/crypto-assets/crypto-currency-asset/crypto-currency-asset-item.layout';
import { createStacksCryptoCurrencyAssetTypeWrapper } from '@app/query/stacks/balance/stacks-ft-balances.utils';
import { StxAvatarIcon } from '@app/ui/components/avatar/stx-avatar-icon';

import { ConnectLedgerAssetBtn } from './connect-ledger-asset-button';

export function AddStacksLedgerKeysItem() {
  return (
    <CryptoCurrencyAssetItemLayout
      assetBalance={createStacksCryptoCurrencyAssetTypeWrapper(new BigNumber(0))}
      icon={<StxAvatarIcon />}
      rightElement={<ConnectLedgerAssetBtn chain="stacks" />}
    />
  );
}
