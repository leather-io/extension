import { useMemo } from 'react';

import BigNumber from 'bignumber.js';

import { useNativeSegwitUtxosByAddress, useRunesEnabled } from '@leather.io/query';
import { createMoney, isUndefined, sumNumbers } from '@leather.io/utils';

import { useInscribedSpendableUtxos } from '@app/features/discarded-inscriptions/use-inscribed-spendable-utxos';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

const defaultZeroValues = {
  protectedBalance: createMoney(0, 'BTC'),
  uneconomicalBalance: createMoney(0, 'BTC'),
};

export function useBtcCryptoAssetBalanceNativeSegwit(address: string) {
  const runesEnabled = useRunesEnabled();

  const spendableInscriptionUtxos = useInscribedSpendableUtxos();

  const availableUtxosQuery = useNativeSegwitUtxosByAddress({
    address,
    filterInscriptionUtxos: true,
    filterPendingTxsUtxos: true,
    filterRunesUtxos: runesEnabled,
  });

  const totalUtxosQuery = useNativeSegwitUtxosByAddress({
    address,
    filterInscriptionUtxos: false,
    filterPendingTxsUtxos: true,
    filterRunesUtxos: false,
  });

  const balance = useMemo(() => {
    if (isUndefined(availableUtxosQuery.data) || isUndefined(totalUtxosQuery.data))
      return {
        ...defaultZeroValues,
        totalBalance: createMoney(new BigNumber(0), 'BTC'),
        availableBalance: createMoney(new BigNumber(0), 'BTC'),
      };
    return {
      ...defaultZeroValues,
      totalBalance: createMoney(sumNumbers(totalUtxosQuery.data.map(utxo => utxo.value)), 'BTC'),
      availableBalance: createMoney(
        // Here we add back in the utxos that are spending beacuse they've been discarded
        sumNumbers(
          [...availableUtxosQuery.data, ...spendableInscriptionUtxos].map(utxo => utxo.value)
        ),
        'BTC'
      ),
    };
  }, [availableUtxosQuery.data, spendableInscriptionUtxos, totalUtxosQuery.data]);

  return { ...availableUtxosQuery, balance };
}

export function useCurrentBtcCryptoAssetBalanceNativeSegwit() {
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  return useBtcCryptoAssetBalanceNativeSegwit(nativeSegwitSigner.address);
}
