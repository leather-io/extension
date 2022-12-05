import { useCallback, useEffect, useMemo, useState } from 'react';

import { StackProps } from '@stacks/ui';
import BigNumber from 'bignumber.js';
import { useField } from 'formik';

import { CryptoCurrencies } from '@shared/models/currencies.model';
import { FeeTypes, Fees } from '@shared/models/fees/_fees.model';
import { createMoney } from '@shared/models/money.model';
import { isNumber, isString } from '@shared/utils';

import { useConvertCryptoCurrencyToFiatAmount } from '@app/common/hooks/use-convert-to-fiat-amount';
import { convertAmountToBaseUnit } from '@app/common/money/calculate-money';
import { LoadingRectangle } from '@app/components/loading-rectangle';

import { CustomFeeField } from './components/custom-fee-field';
import { FeeEstimateSelect } from './components/fee-estimate-select';
import { FeesRowLayout } from './components/fees-row.layout';
import { TransactionFee } from './components/transaction-fee';

interface FeeRowProps extends StackProps {
  fees?: Fees;
  isSponsored: boolean;
}
export function FeesRow(props: FeeRowProps): JSX.Element {
  const { fees, isSponsored, ...rest } = props;
  const [feeField, _, feeHelper] = useField('fee');
  const [feeTypeField, __, feeTypeHelper] = useField('feeType');
  const [fieldWarning, setFieldWarning] = useState<string | undefined>(undefined);
  const [isSelectVisible, setIsSelectVisible] = useState(false);

  const isCustom = feeTypeField.value === FeeTypes[FeeTypes.Custom];
  const selectedItem = Number(FeeTypes[feeTypeField.value]);

  const hasFeeEstimates = fees?.estimates.length;
  const feeCurrencySymbol = fees?.estimates[0].fee.symbol as CryptoCurrencies;
  const convertCryptoCurrencyToUsd = useConvertCryptoCurrencyToFiatAmount(feeCurrencySymbol);

  const feeInUsd = useMemo(() => {
    if ((!isNumber(feeField.value) && !isString(feeField.value)) || !feeCurrencySymbol) return null;
    const feeAsMoney = createMoney(new BigNumber(feeField.value), feeCurrencySymbol);
    return convertCryptoCurrencyToUsd(feeAsMoney);
  }, [convertCryptoCurrencyToUsd, feeCurrencySymbol, feeField.value]);

  useEffect(() => {
    if (hasFeeEstimates && !feeField.value && !isCustom) {
      feeHelper.setValue(convertAmountToBaseUnit(fees.estimates[FeeTypes.Middle].fee).toNumber());
      feeTypeHelper.setValue(FeeTypes[FeeTypes.Middle]);
    }
    if (isSponsored) {
      feeHelper.setValue(0);
    }
  }, [
    feeField.value,
    feeHelper,
    feeTypeHelper,
    fees?.estimates,
    hasFeeEstimates,
    isCustom,
    isSponsored,
  ]);

  const handleSelectFeeEstimateOrCustomField = useCallback(
    (index: number) => {
      feeTypeHelper.setValue(FeeTypes[index]);
      if (index === FeeTypes.Custom) feeHelper.setValue('');
      else
        fees && feeHelper.setValue(convertAmountToBaseUnit(fees.estimates[index].fee).toNumber());
      setFieldWarning('');
      setIsSelectVisible(false);
    },
    [feeTypeHelper, feeHelper, fees]
  );

  if (!hasFeeEstimates) return <LoadingRectangle height="32px" width="100%" {...rest} />;

  return (
    <FeesRowLayout
      feeField={
        isCustom ? (
          <CustomFeeField
            lowFeeEstimate={fees.estimates[FeeTypes.Low]}
            setFieldWarning={(value: string) => setFieldWarning(value)}
          />
        ) : (
          <TransactionFee
            fee={feeField.value}
            feeCurrencySymbol={feeCurrencySymbol}
            usdAmount={feeInUsd}
          />
        )
      }
      fieldWarning={fieldWarning}
      isSponsored={isSponsored}
      selectInput={
        <FeeEstimateSelect
          isVisible={isSelectVisible}
          items={fees.estimates}
          onSelectItem={handleSelectFeeEstimateOrCustomField}
          onSetIsSelectVisible={(value: boolean) => setIsSelectVisible(value)}
          selectedItem={selectedItem}
        />
      }
      {...rest}
    />
  );
}
