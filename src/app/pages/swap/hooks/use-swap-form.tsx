import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { type SwapAsset } from '@leather.io/query';
import { convertAmountToFractionalUnit, createMoney } from '@leather.io/utils';

import { FormErrorMessages } from '@shared/error-messages';
import { type SwapFormValues } from '@shared/models/form.model';

import { useSwapContext } from '../swap.context';

export function useSwapForm() {
  const { isFetchingExchangeRate } = useSwapContext();

  const initialValues: SwapFormValues = {
    fee: '0',
    feeCurrency: '',
    feeType: '',
    nonce: 0,
    swapAmountBase: '',
    swapAmountQuote: '',
    swapAssetBase: undefined,
    swapAssetQuote: undefined,
  };

  const validationSchema = yup.object({
    swapAssetBase: yup.object<SwapAsset>().required(),
    swapAssetQuote: yup.object<SwapAsset>().required(),
    swapAmountBase: yup
      .number()
      .test({
        message: 'Insufficient balance',
        test(value) {
          if (isFetchingExchangeRate) return true;
          const { swapAssetBase } = this.parent;
          const valueInFractionalUnit = convertAmountToFractionalUnit(
            createMoney(
              new BigNumber(Number(value)),
              swapAssetBase.balance.symbol,
              swapAssetBase.balance.decimals
            )
          );
          if (swapAssetBase.balance.amount.isLessThan(valueInFractionalUnit)) return false;
          return true;
        },
      })
      .required(FormErrorMessages.AmountRequired)
      .typeError(FormErrorMessages.MustBeNumber)
      .positive(FormErrorMessages.MustBePositive),
    swapAmountQuote: yup
      .number()
      .required(FormErrorMessages.AmountRequired)
      .typeError(FormErrorMessages.MustBeNumber)
      .positive(FormErrorMessages.MustBePositive),
  });

  return {
    initialValues,
    validationSchema,
  };
}
