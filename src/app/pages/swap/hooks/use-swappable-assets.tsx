import BtcIcon from '@assets/images/btc-icon.png';
import XBtcIcon from '@assets/images/xbtc-icon.png';
import BigNumber from 'bignumber.js';

import { createMoney } from '@shared/models/money.model';

import { useNativeSegwitBalance } from '@app/query/bitcoin/balance/bitcoin-balances.query';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { SwapAsset } from './use-swap';

export const tempExchangeRate = 0.5;

export function useSwappableAssets() {
  const { address } = useCurrentAccountNativeSegwitIndexZeroSigner();
  const { balance: btcBalance } = useNativeSegwitBalance(address);
  // TODO: Filter these assets for list to swap, not sure if need?
  // const allTransferableCryptoAssetBalances = useAllTransferableCryptoAssetBalances();

  // TODO: Replace with live asset list
  const tempSwapAssetFrom: SwapAsset = {
    balance: btcBalance,
    icon: BtcIcon,
    name: 'Bitcoin',
  };

  const tempSwapAssetTo: SwapAsset = {
    balance: createMoney(new BigNumber(0), 'xBTC', 0),
    icon: XBtcIcon,
    name: 'Wrapped Bitcoin',
  };

  return {
    swappableAssets: [tempSwapAssetFrom, tempSwapAssetTo],
  };
}
