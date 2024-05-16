import { useMemo } from 'react';

import type { BtcCryptoAssetBalance, Money } from '@leather-wallet/models';
import BigNumber from 'bignumber.js';

import { createMoney } from '@shared/models/money.model';
import { isUndefined } from '@shared/utils';

import { sumNumbers } from '@app/common/math/helpers';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { useNativeSegwitUtxosByAddress } from '../address/utxos-by-address.hooks';
import { useRunesEnabled } from '../runes/runes.hooks';

function createBtcCryptoAssetBalance(balance: Money): BtcCryptoAssetBalance {
  return {
    availableBalance: balance,
    // TODO: Can we determine these here or are they nec?
    protectedBalance: createMoney(0, 'BTC'),
    uneconomicalBalance: createMoney(0, 'BTC'),
  };
}

export function useBtcCryptoAssetBalanceNativeSegwit(address: string) {
  const runesEnabled = useRunesEnabled();

  const {
    data: utxos,
    isInitialLoading,
    isLoading,
    isFetching,
  } = useNativeSegwitUtxosByAddress({
    address,
    filterInscriptionUtxos: true,
    filterPendingTxsUtxos: true,
    filterRunesUtxos: runesEnabled,
  });

  const balance = useMemo(() => {
    if (isUndefined(utxos))
      return createBtcCryptoAssetBalance(createMoney(new BigNumber(0), 'BTC'));
    return createBtcCryptoAssetBalance(
      createMoney(sumNumbers(utxos.map(utxo => utxo.value)), 'BTC')
    );
  }, [utxos]);

  return {
    balance,
    isInitialLoading,
    isLoading,
    isFetching,
  };
}

export function useCurrentBtcCryptoAssetBalanceNativeSegwit() {
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  return useBtcCryptoAssetBalanceNativeSegwit(nativeSegwitSigner.address);
}
