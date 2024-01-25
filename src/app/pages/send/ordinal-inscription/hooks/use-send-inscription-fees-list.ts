import { useMemo } from 'react';

import { BtcFeeType, btcTxTimeMap } from '@shared/models/fees/bitcoin-fees.model';
import { createMoney } from '@shared/models/money.model';

import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { formatMoneyPadded, i18nFormatCurrency } from '@app/common/money/format-money';
import { FeesListItem } from '@app/components/bitcoin-fees-list/bitcoin-fees-list';
import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';
import { UtxoWithDerivationPath } from '@app/query/bitcoin/bitcoin-client';
import { useAverageBitcoinFeeRates } from '@app/query/bitcoin/fees/fee-estimates.hooks';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';
import { useCurrentAccountNativeSegwitSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { selectInscriptionTransferCoins } from '../coinselect/select-inscription-coins';

interface UseSendInscriptionFeesListArgs {
  recipient: string;
  utxo: UtxoWithDerivationPath;
}
export function useSendInscriptionFeesList({ recipient, utxo }: UseSendInscriptionFeesListArgs) {
  const createNativeSegwitSigner = useCurrentAccountNativeSegwitSigner();
  const { data: nativeSegwitUtxos } = useCurrentNativeSegwitUtxos();

  const btcMarketData = useCryptoCurrencyMarketData('BTC');
  const { data: feeRates, isLoading } = useAverageBitcoinFeeRates();

  const feesList: FeesListItem[] = useMemo(() => {
    function getFiatFeeValue(fee: number) {
      return `~ ${i18nFormatCurrency(
        baseCurrencyAmountInQuote(createMoney(Math.ceil(fee), 'BTC'), btcMarketData)
      )}`;
    }

    const nativeSegwitSigner = createNativeSegwitSigner?.(0);

    if (!feeRates || !nativeSegwitUtxos || !nativeSegwitSigner) return [];

    const highFeeResult = selectInscriptionTransferCoins({
      recipient,
      inscriptionInput: utxo,
      nativeSegwitUtxos,
      changeAddress: nativeSegwitSigner.payment.address!,
      feeRate: feeRates.fastestFee.toNumber(),
    });

    const standardFeeResult = selectInscriptionTransferCoins({
      recipient,
      inscriptionInput: utxo,
      nativeSegwitUtxos,
      changeAddress: nativeSegwitSigner.payment.address!,
      feeRate: feeRates.halfHourFee.toNumber(),
    });

    const lowFeeResult = selectInscriptionTransferCoins({
      recipient,
      inscriptionInput: utxo,
      nativeSegwitUtxos,
      changeAddress: nativeSegwitSigner.payment.address!,
      feeRate: feeRates.hourFee.toNumber(),
    });

    if (!highFeeResult.success || !standardFeeResult.success || !lowFeeResult.success) return [];

    const { txFee: highFeeValue } = highFeeResult;
    const { txFee: standardFeeValue } = standardFeeResult;
    const { txFee: lowFeeValue } = lowFeeResult;

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
  }, [createNativeSegwitSigner, feeRates, nativeSegwitUtxos, recipient, utxo, btcMarketData]);

  return {
    feesList,
    isLoading,
  };
}
