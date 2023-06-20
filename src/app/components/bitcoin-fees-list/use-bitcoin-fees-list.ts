import { useMemo } from 'react';

import { BtcFeeType, btcTxTimeMap } from '@shared/models/fees/bitcoin-fees.model';
import { createMoney } from '@shared/models/money.model';

import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { formatMoneyPadded, i18nFormatCurrency } from '@app/common/money/format-money';
import { btcToSat } from '@app/common/money/unit-conversion';
import {
  DetermineUtxosForSpendArgs,
  determineUtxosForSpend,
  determineUtxosForSpendAll,
} from '@app/common/transactions/bitcoin/coinselect/local-coin-selection';
import { useSpendableNativeSegwitUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';
import { useAverageBitcoinFeeRates } from '@app/query/bitcoin/fees/fee-estimates.hooks';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { FeesListItem } from './bitcoin-fees-list';

function getFeeForList(
  determineUtxosForFeeArgs: DetermineUtxosForSpendArgs,
  isSendingMax?: boolean
) {
  const { fee } = isSendingMax
    ? determineUtxosForSpendAll(determineUtxosForFeeArgs)
    : determineUtxosForSpend(determineUtxosForFeeArgs);
  return fee;
}

interface UseBitcoinFeesListArgs {
  amount: number;
  isSendingMax?: boolean;
  recipient: string;
}
export function useBitcoinFeesList({ amount, isSendingMax, recipient }: UseBitcoinFeesListArgs) {
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  const { data: utxos } = useSpendableNativeSegwitUtxos(nativeSegwitSigner.address);

  const btcMarketData = useCryptoCurrencyMarketData('BTC');
  const { data: feeRates, isLoading } = useAverageBitcoinFeeRates();

  const feesList: FeesListItem[] = useMemo(() => {
    function getFiatFeeValue(fee: number) {
      return `~ ${i18nFormatCurrency(
        baseCurrencyAmountInQuote(createMoney(Math.ceil(fee), 'BTC'), btcMarketData)
      )}`;
    }

    if (!feeRates || !utxos || !utxos.length) return [];

    const satAmount = btcToSat(amount).toNumber();

    const determineUtxosDefaultArgs = {
      amount: satAmount,
      recipient,
      utxos,
    };

    const determineUtxosForHighFeeArgs = {
      ...determineUtxosDefaultArgs,
      feeRate: feeRates.fastestFee.toNumber(),
    };

    const determineUtxosForStandardFeeArgs = {
      ...determineUtxosDefaultArgs,
      feeRate: feeRates.halfHourFee.toNumber(),
    };

    const determineUtxosForLowFeeArgs = {
      ...determineUtxosDefaultArgs,
      feeRate: feeRates.hourFee.toNumber(),
    };

    const highFeeValue = getFeeForList(determineUtxosForHighFeeArgs, isSendingMax);
    const standardFeeValue = getFeeForList(determineUtxosForStandardFeeArgs, isSendingMax);
    const lowFeeValue = getFeeForList(determineUtxosForLowFeeArgs, isSendingMax);

    return [
      {
        label: BtcFeeType.High,
        value: highFeeValue,
        btcValue: formatMoneyPadded(createMoney(highFeeValue, 'BTC')),
        time: btcTxTimeMap.fastestFee,
        fiatValue: getFiatFeeValue(highFeeValue),
        feeRate: feeRates.fastestFee.toNumber(),
      },
      {
        label: BtcFeeType.Standard,
        value: standardFeeValue,
        btcValue: formatMoneyPadded(createMoney(standardFeeValue, 'BTC')),
        time: btcTxTimeMap.halfHourFee,
        fiatValue: getFiatFeeValue(standardFeeValue),
        feeRate: feeRates.halfHourFee.toNumber(),
      },
      {
        label: BtcFeeType.Low,
        value: lowFeeValue,
        btcValue: formatMoneyPadded(createMoney(lowFeeValue, 'BTC')),
        time: btcTxTimeMap.hourFee,
        fiatValue: getFiatFeeValue(lowFeeValue),
        feeRate: feeRates.hourFee.toNumber(),
      },
    ];
  }, [feeRates, utxos, amount, recipient, isSendingMax, btcMarketData]);

  return {
    feesList,
    isLoading,
  };
}
