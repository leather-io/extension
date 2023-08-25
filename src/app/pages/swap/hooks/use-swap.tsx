import * as yup from 'yup';

import { Money } from '@shared/models/money.model';

import { FormErrorMessages } from '@app/common/error-messages';
// import { tokenAmountValidator } from '@app/common/validation/forms/amount-validators';
import { currencyAmountValidator } from '@app/common/validation/forms/currency-validators';

export interface SwapAsset {
  balance: Money;
  icon: string;
  name: string;
}

export interface SwapFormValues {
  swapAmountFrom: string;
  swapAmountTo: string;
  swapAssetFrom?: SwapAsset;
  swapAssetTo?: SwapAsset;
}

export function useSwap() {
  const initialValues: SwapFormValues = {
    swapAmountFrom: '',
    swapAmountTo: '',
    swapAssetFrom: undefined,
    swapAssetTo: undefined,
  };

  // TODO: Need to add insufficient balance validation
  // Validate directly on Field once asset is selected?
  const validationSchema = yup.object({
    swapAmountFrom: yup
      .number()
      .required(FormErrorMessages.AmountRequired)
      .concat(currencyAmountValidator()),
    // .concat(tokenAmountValidator(balance)),
    swapAmountTo: yup
      .number()
      .required(FormErrorMessages.AmountRequired)
      .concat(currencyAmountValidator()),
    // .concat(tokenAmountValidator(balance)),
    swapAssetFrom: yup.object<SwapAsset>().required(),
    swapAssetTo: yup.object<SwapAsset>().required(),
  });

  return {
    initialValues,
    validationSchema,
  };
}
