import { useMemo } from 'react';

import { BtcFeeType, btcTxTimeMap } from '@shared/models/fees/bitcoin-fees.model';
import { createMoney } from '@shared/models/money.model';

import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { formatMoneyPadded, i18nFormatCurrency } from '@app/common/money/format-money';
import { btcToSat } from '@app/common/money/unit-conversion';
import { determineUtxosForSpend } from '@app/common/transactions/bitcoin/coinselect/local-coin-selection';
import { useGetUtxosByAddressQuery } from '@app/query/bitcoin/address/utxos-by-address.query';
import { useAverageBitcoinFeeRates } from '@app/query/bitcoin/fees/fee-estimates.hooks';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';
import { useCurrentBtcNativeSegwitAccountAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { FeesListItem } from './bitcoin-fees-list';

interface UseBitcoinFeesListArgs {
  amount: number;
  recipient: string;
}
export function useBitcoinFeesList({ amount, recipient }: UseBitcoinFeesListArgs) {
  const currentAccountBtcAddress = useCurrentBtcNativeSegwitAccountAddressIndexZero();
  const { data: utxos } = useGetUtxosByAddressQuery(currentAccountBtcAddress);

  const btcMarketData = useCryptoCurrencyMarketData('BTC');
  const { avgApiFeeRates: feeRate, isLoading } = useAverageBitcoinFeeRates();

  const feesList: FeesListItem[] = useMemo(() => {
    function getFiatFeeValue(fee: number) {
      return `~ ${i18nFormatCurrency(
        baseCurrencyAmountInQuote(createMoney(Math.ceil(fee), 'BTC'), btcMarketData)
      )}`;
    }

    if (!feeRate || !utxos) return [];

    const satAmount = btcToSat(amount).toNumber();
    const { fee: highFeeValue } = determineUtxosForSpend({
      utxos,
      recipient,
      amount: satAmount,
      feeRate: feeRate.fastestFee.toNumber(),
    });

    const { fee: standardFeeValue } = determineUtxosForSpend({
      utxos,
      recipient,
      amount: satAmount,
      feeRate: feeRate.halfHourFee.toNumber(),
    });

    const { fee: lowFeeValue } = determineUtxosForSpend({
      utxos,
      recipient,
      amount: satAmount,
      feeRate: feeRate.hourFee.toNumber(),
    });

    return [
      {
        label: BtcFeeType.High,
        value: highFeeValue,
        btcValue: formatMoneyPadded(createMoney(highFeeValue, 'BTC')),
        time: btcTxTimeMap.fastestFee,
        fiatValue: getFiatFeeValue(highFeeValue),
        feeRate: feeRate.fastestFee.toNumber(),
      },
      {
        label: BtcFeeType.Standard,
        value: standardFeeValue,
        btcValue: formatMoneyPadded(createMoney(standardFeeValue, 'BTC')),
        time: btcTxTimeMap.halfHourFee,
        fiatValue: getFiatFeeValue(standardFeeValue),
        feeRate: feeRate.halfHourFee.toNumber(),
      },
      {
        label: BtcFeeType.Low,
        value: lowFeeValue,
        btcValue: formatMoneyPadded(createMoney(lowFeeValue, 'BTC')),
        time: btcTxTimeMap.hourFee,
        fiatValue: getFiatFeeValue(lowFeeValue),
        feeRate: feeRate.hourFee.toNumber(),
      },
    ];
  }, [feeRate, btcMarketData, utxos, recipient, amount]);

  return {
    feesList,
    isLoading,
  };
}
