import BigNumber from 'bignumber.js';

import { CryptoCurrencyAssetItemLayout } from '@app/components/crypto-assets/crypto-currency-asset/crypto-currency-asset-item.layout';
import { StxAvatar } from '@app/components/crypto-assets/stacks/components/stx-avatar';
import { createStacksCryptoCurrencyAssetTypeWrapper } from '@app/query/stacks/balance/stacks-ft-balances.utils';

import { ConnectLedgerAssetBtn } from './connect-ledger-asset-button';

export function AddStacksLedgerKeysItem() {
  return (
    <CryptoCurrencyAssetItemLayout
      assetBalance={createStacksCryptoCurrencyAssetTypeWrapper(new BigNumber(0))}
      icon={<StxAvatar />}
      rightElement={<ConnectLedgerAssetBtn chain="stacks" />}
    />
  );
}
