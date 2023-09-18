import { Currency } from 'alex-sdk';
import * as yup from 'yup';

import { FeeTypes } from '@shared/models/fees/fees.model';
import { StacksTransactionFormValues } from '@shared/models/form.model';
import { Money } from '@shared/models/money.model';

import { FormErrorMessages } from '@app/common/error-messages';
// import { tokenAmountValidator } from '@app/common/validation/forms/amount-validators';
import { useNextNonce } from '@app/query/stacks/nonce/account-nonces.hooks';

export interface SwapAsset {
  balance: Money;
  currency: Currency;
  icon: string;
  name: string;
}

export interface SwapFormValues extends StacksTransactionFormValues {
  swapAmountFrom: string;
  swapAmountTo: string;
  swapAssetFrom?: SwapAsset;
  swapAssetTo?: SwapAsset;
}

export function useSwap() {
  const { data: nextNonce } = useNextNonce();

  const initialValues: SwapFormValues = {
    fee: '0',
    feeCurrency: 'STX',
    feeType: FeeTypes[FeeTypes.Middle],
    nonce: nextNonce?.nonce,
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
      .typeError(FormErrorMessages.MustBeNumber)
      .positive(FormErrorMessages.MustBePositive),
    // .concat(tokenAmountValidator(balance)),
    swapAmountTo: yup
      .number()
      .required(FormErrorMessages.AmountRequired)
      .typeError(FormErrorMessages.MustBeNumber)
      .positive(FormErrorMessages.MustBePositive),
    // .concat(tokenAmountValidator(balance)),
    swapAssetFrom: yup.object<SwapAsset>().required(),
    swapAssetTo: yup.object<SwapAsset>().required(),
  });

  return {
    initialValues,
    validationSchema,
  };
}
