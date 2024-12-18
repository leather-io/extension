import { useMemo } from 'react';

import BigNumber from 'bignumber.js';

import type { BtcCryptoAssetBalance, Money } from '@leather.io/models';
import { useNativeSegwitUtxosByAddress, useRunesEnabled } from '@leather.io/query';
import { createMoney, isUndefined, sumNumbers } from '@leather.io/utils';

import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

function createBtcCryptoAssetBalance(balance: Money): BtcCryptoAssetBalance {
  return {
    availableBalance: balance,
    protectedBalance: createMoney(0, 'BTC'),
    uneconomicalBalance: createMoney(0, 'BTC'),
  };
}

export function useBtcCryptoAssetBalanceNativeSegwit(address: string) {
  const runesEnabled = useRunesEnabled();
  console.log({ runesEnabled });

  // Force filtering off here too
  const query = useNativeSegwitUtxosByAddress({
    address,
    filterInscriptionUtxos: false,
    filterPendingTxsUtxos: true,
    filterRunesUtxos: false,
  });

  const balance = useMemo(() => {
    if (isUndefined(query.data))
      return createBtcCryptoAssetBalance(createMoney(new BigNumber(0), 'BTC'));
    return createBtcCryptoAssetBalance(
      createMoney(sumNumbers(query.data.map(utxo => utxo.value)), 'BTC')
    );
  }, [query.data]);

  return {
    ...query,
    balance,
  };
}

export function useCurrentBtcCryptoAssetBalanceNativeSegwit() {
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  return useBtcCryptoAssetBalanceNativeSegwit(nativeSegwitSigner.address);
}
