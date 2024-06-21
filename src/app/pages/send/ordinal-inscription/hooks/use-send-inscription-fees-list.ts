import { useCallback, useMemo } from 'react';

import { BtcFeeType, Inscription, btcTxTimeMap } from '@leather.io/models';
import {
  type UtxoWithDerivationPath,
  useAverageBitcoinFeeRates,
  useCryptoCurrencyMarketDataMeanAverage,
} from '@leather.io/query';
import {
  baseCurrencyAmountInQuote,
  createMoney,
  formatMoneyPadded,
  i18nFormatCurrency,
} from '@leather.io/utils';

import { FeesListItem } from '@app/components/bitcoin-fees-list/bitcoin-fees-list';
import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';
import { useCurrentAccountNativeSegwitSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { useGenerateUnsignedOrdinalTx } from './use-generate-ordinal-tx';

interface UseSendInscriptionFeesListArgs {
  recipient: string;
  utxo: UtxoWithDerivationPath;
  inscription: Inscription;
}

export function useSendInscriptionFeesList({
  recipient,
  utxo,
  inscription,
}: UseSendInscriptionFeesListArgs) {
  const createNativeSegwitSigner = useCurrentAccountNativeSegwitSigner();
  const { data: nativeSegwitUtxos } = useCurrentNativeSegwitUtxos();

  const btcMarketData = useCryptoCurrencyMarketDataMeanAverage('BTC');
  const { data: feeRates, isLoading } = useAverageBitcoinFeeRates();

  const { coverFeeFromAdditionalUtxos } = useGenerateUnsignedOrdinalTx(utxo);

  const getTransactionFee = useCallback(
    (feeRate: number) => {
      try {
        const tx = coverFeeFromAdditionalUtxos({
          recipient,
          feeRate,
          inscription,
        });

        return tx?.txFee;
      } catch (error) {
        return null;
      }
    },
    [coverFeeFromAdditionalUtxos, recipient, inscription]
  );

  const feesList: FeesListItem[] = useMemo(() => {
    function getFiatFeeValue(fee: number) {
      return `~ ${i18nFormatCurrency(
        baseCurrencyAmountInQuote(createMoney(Math.ceil(fee), 'BTC'), btcMarketData)
      )}`;
    }

    const nativeSegwitSigner = createNativeSegwitSigner?.(0);

    if (!feeRates || !nativeSegwitUtxos || !nativeSegwitSigner) return [];

    const highFeeValue = getTransactionFee(feeRates.fastestFee.toNumber());
    const standardFeeValue = getTransactionFee(feeRates.halfHourFee.toNumber());
    const lowFeeValue = getTransactionFee(feeRates.hourFee.toNumber());

    const feesArr = [];

    if (highFeeValue) {
      feesArr.push({
        label: BtcFeeType.High,
        value: highFeeValue,
        btcValue: formatMoneyPadded(createMoney(highFeeValue, 'BTC')),
        time: btcTxTimeMap.fastestFee,
        fiatValue: getFiatFeeValue(highFeeValue),
        feeRate: feeRates.fastestFee.toNumber(),
      });
    }

    if (standardFeeValue) {
      feesArr.push({
        label: BtcFeeType.Standard,
        value: standardFeeValue,
        btcValue: formatMoneyPadded(createMoney(standardFeeValue, 'BTC')),
        time: btcTxTimeMap.halfHourFee,
        fiatValue: getFiatFeeValue(standardFeeValue),
        feeRate: feeRates.halfHourFee.toNumber(),
      });
    }

    if (lowFeeValue) {
      feesArr.push({
        label: BtcFeeType.Low,
        value: lowFeeValue,
        btcValue: formatMoneyPadded(createMoney(lowFeeValue, 'BTC')),
        time: btcTxTimeMap.hourFee,
        fiatValue: getFiatFeeValue(lowFeeValue),
        feeRate: feeRates.hourFee.toNumber(),
      });
    }

    return feesArr;
  }, [feeRates, nativeSegwitUtxos, btcMarketData, createNativeSegwitSigner, getTransactionFee]);

  return {
    feesList,
    isLoading,
  };
}
