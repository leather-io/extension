import { useCallback, useEffect, useMemo, useState } from 'react';

import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import BigNumber from 'bignumber.js';
import { useField } from 'formik';
import { Box } from 'leather-styles/jsx';

import { STX_DECIMALS } from '@leather.io/constants';
import { FeeTypes, type Fees } from '@leather.io/models';
import { convertAmountToBaseUnit, createMoney, isNumber, isString } from '@leather.io/utils';

import { useConvertCryptoCurrencyToFiatAmount } from '@app/common/hooks/use-convert-to-fiat-amount';
import { LoadingRectangle } from '@app/components/loading-rectangle';

import { CustomFeeField } from './components/custom-fee-field';
import { FeeEstimateSelect } from './components/fee-estimate-select';
import { FeesRowLayout } from './components/fees-row.layout';
import { TransactionFee } from './components/transaction-fee';

interface FeeRowProps {
  fees?: Fees;
  allowCustom?: boolean;
  isSponsored: boolean;
  defaultFeeValue?: number;
  disableFeeSelection?: boolean;
}
export function FeesRow({
  fees,
  isSponsored,
  allowCustom = true,
  defaultFeeValue,
  disableFeeSelection,
}: FeeRowProps) {
  const [feeField, _, feeHelper] = useField('fee');
  const [feeCurrencyField] = useField('feeCurrency');
  const [feeTypeField, __, feeTypeHelper] = useField('feeType');
  const [fieldWarning, setFieldWarning] = useState<string | undefined>(undefined);
  const [isSelectVisible, setIsSelectVisible] = useState(false);

  const isCustom = feeTypeField.value === FeeTypes[FeeTypes.Custom];
  const selectedItem = Number(FeeTypes[feeTypeField.value]);

  const hasFeeEstimates = fees?.estimates.length;
  const feeCurrencySymbol = feeCurrencyField.value;

  const convertCryptoCurrencyToUsd = useConvertCryptoCurrencyToFiatAmount(feeCurrencySymbol);

  const feeInUsd = useMemo(() => {
    if ((!isNumber(feeField.value) && !isString(feeField.value)) || !feeCurrencySymbol) return null;
    const feeAsMoney = createMoney(new BigNumber(feeField.value), feeCurrencySymbol);
    return convertCryptoCurrencyToUsd(feeAsMoney);
  }, [convertCryptoCurrencyToUsd, feeCurrencySymbol, feeField.value]);

  useEffect(() => {
    if (defaultFeeValue) {
      void feeHelper.setValue(
        convertAmountToBaseUnit(new BigNumber(Number(defaultFeeValue)), STX_DECIMALS).toString()
      );
      void feeTypeHelper.setValue(FeeTypes[FeeTypes.Custom]);
    }
  }, [feeHelper, defaultFeeValue, feeTypeHelper]);

  useEffect(() => {
    if (isSponsored) {
      void feeHelper.setValue(0);
      return;
    }

    if (!defaultFeeValue && hasFeeEstimates && !feeField.value && !isCustom) {
      void feeHelper.setValue(
        convertAmountToBaseUnit(fees.estimates[FeeTypes.Middle].fee).toString()
      );
      void feeTypeHelper.setValue(FeeTypes[FeeTypes.Middle]);
      return;
    }
  }, [
    defaultFeeValue,
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
      void feeTypeHelper.setValue(FeeTypes[index]);
      if (index === FeeTypes.Custom)
        void feeHelper.setValue(
          defaultFeeValue
            ? convertAmountToBaseUnit(new BigNumber(Number(defaultFeeValue)), STX_DECIMALS)
            : ''
        );
      else
        fees &&
          void feeHelper.setValue(convertAmountToBaseUnit(fees.estimates[index].fee).toString());
      setFieldWarning('');
      setIsSelectVisible(false);
    },
    [feeTypeHelper, feeHelper, fees, defaultFeeValue]
  );

  if (!hasFeeEstimates) return <LoadingRectangle height="32px" width="100%" />;

  return (
    <FeesRowLayout
      data-testid={SharedComponentsSelectors.FeeRow}
      feeField={
        isCustom ? (
          <CustomFeeField
            disableFeeSelection={disableFeeSelection}
            feeCurrencySymbol={feeCurrencySymbol}
            lowFeeEstimate={fees.estimates[FeeTypes.Low]}
            setFieldWarning={(value: string) => setFieldWarning(value)}
          />
        ) : (
          <Box
            onClick={() => handleSelectFeeEstimateOrCustomField(FeeTypes.Custom)}
            textAlign="right"
            width="100%"
          >
            <TransactionFee
              fee={feeField.value}
              feeCurrencySymbol={feeCurrencySymbol}
              usdAmount={feeInUsd}
            />
          </Box>
        )
      }
      fieldWarning={fieldWarning}
      isSponsored={isSponsored}
      selectInput={
        <FeeEstimateSelect
          disableFeeSelection={disableFeeSelection}
          allowCustom={allowCustom}
          isVisible={isSelectVisible}
          estimate={fees.estimates}
          onSelectItem={(index: number) => handleSelectFeeEstimateOrCustomField(index)}
          onSetIsSelectVisible={(value: boolean) => setIsSelectVisible(value)}
          selectedItem={selectedItem}
        />
      }
    />
  );
}
