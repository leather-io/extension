import { useCallback } from 'react';

import { getAddressInfo, validate } from 'bitcoin-address-validation';

import { createMoney } from '@shared/models/money.model';

import { satToBtc } from '@app/common/money/unit-conversion';
import { useCurrentBitcoinAddressBalance } from '@app/query/bitcoin/address/address.hooks';
import { useGetUtxosByAddressQuery } from '@app/query/bitcoin/address/utxos-by-address.query';
import { useBitcoinFeeRate } from '@app/query/bitcoin/fees/fee-estimates.hooks';
import { useCurrentBtcAccountAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/bitcoin-account.hooks';

import { BtcSizeFeeEstimator } from '../fees/tx-size-calculator';

export function useCalculateMaxBitcoinSpend() {
  const currentAccountBtcAddress = useCurrentBtcAccountAddressIndexZero();
  const balance = useCurrentBitcoinAddressBalance();
  const { data: utxos } = useGetUtxosByAddressQuery(currentAccountBtcAddress);
  const { data: feeRate } = useBitcoinFeeRate();

  return useCallback(
    (address = '') => {
      if (!utxos || !feeRate) return;
      const txSizer = new BtcSizeFeeEstimator();
      const addressInfo = validate(address) ? getAddressInfo(address) : null;
      const addressTypeWithFallback = addressInfo ? addressInfo.type : 'p2wpkh';
      const size = txSizer.calcTxSize({
        input_script: 'p2wpkh',
        input_count: utxos.length,
        [`${addressTypeWithFallback}_output_count`]: 2,
      });
      const fee = Math.ceil(size.txVBytes * feeRate.fastestFee);
      return {
        spendAllFee: fee,
        amount: createMoney(balance.amount.minus(fee), 'BTC'),
        spendableBitcoin: satToBtc(balance.amount.minus(fee)),
      };
    },
    [balance.amount, feeRate, utxos]
  );
}
