import { useCallback } from 'react';

import BigNumber from 'bignumber.js';
import { getAddressInfo, validate } from 'bitcoin-address-validation';

import { createMoney } from '@shared/models/money.model';

import { satToBtc } from '@app/common/money/unit-conversion';
import { BtcSizeFeeEstimator } from '@app/common/transactions/bitcoin/fees/btc-size-fee-estimator';
import { useGetUtxosByAddressQuery } from '@app/query/bitcoin/address/utxos-by-address.query';
import { useCurrentNativeSegwitAddressBalance } from '@app/query/bitcoin/balance/bitcoin-balances.query';
import { useAverageBitcoinFeeRates } from '@app/query/bitcoin/fees/fee-estimates.hooks';
import { useCurrentBtcNativeSegwitAccountAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

export function useCalculateMaxBitcoinSpend() {
  const currentAccountBtcAddress = useCurrentBtcNativeSegwitAccountAddressIndexZero();
  const balance = useCurrentNativeSegwitAddressBalance();
  const { data: utxos } = useGetUtxosByAddressQuery(currentAccountBtcAddress);
  const { avgApiFeeRates: feeRates } = useAverageBitcoinFeeRates();

  return useCallback(
    (address = '') => {
      if (!utxos || !feeRates)
        return {
          spendAllFee: 0,
          amount: createMoney(0, 'BTC'),
          spendableBitcoin: new BigNumber(0),
        };

      const txSizer = new BtcSizeFeeEstimator();
      const addressInfo = validate(address) ? getAddressInfo(address) : null;
      const addressTypeWithFallback = addressInfo ? addressInfo.type : 'p2wpkh';
      const size = txSizer.calcTxSize({
        input_script: 'p2wpkh',
        input_count: utxos.length,
        [`${addressTypeWithFallback}_output_count`]: 2,
      });
      const fee = Math.ceil(size.txVBytes * feeRates.hourFee.toNumber());

      const spendableAmount = BigNumber.max(0, balance.amount.minus(fee));

      return {
        spendAllFee: fee,
        amount: createMoney(spendableAmount, 'BTC'),
        spendableBitcoin: satToBtc(spendableAmount),
      };
    },
    [balance.amount, feeRates, utxos]
  );
}
