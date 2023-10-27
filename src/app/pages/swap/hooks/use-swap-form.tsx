import { Currency } from 'alex-sdk';
import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { FeeTypes } from '@shared/models/fees/fees.model';
import { StacksTransactionFormValues } from '@shared/models/form.model';
import { Money, createMoney } from '@shared/models/money.model';

import { FormErrorMessages } from '@app/common/error-messages';
import { convertAmountToFractionalUnit } from '@app/common/money/calculate-money';
import { useNextNonce } from '@app/query/stacks/nonce/account-nonces.hooks';

export interface SwapAsset {
  balance: Money;
  currency: Currency;
  displayName?: string;
  icon: string;
  name: string;
  price: Money;
  principal: string;
}

export interface SwapFormValues extends StacksTransactionFormValues {
  swapAmountFrom: string;
  swapAmountTo: string;
  swapAssetFrom?: SwapAsset;
  swapAssetTo?: SwapAsset;
}

export function useSwapForm() {
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

  const validationSchema = yup.object({
    swapAssetFrom: yup.object<SwapAsset>().required(),
    swapAssetTo: yup.object<SwapAsset>().required(),
    swapAmountFrom: yup
      .number()
      .test({
        message: 'Insufficient balance',
        test(value) {
          const { swapAssetFrom } = this.parent;
          const valueInFractionalUnit = convertAmountToFractionalUnit(
            createMoney(
              new BigNumber(Number(value)),
              swapAssetFrom.balance.symbol,
              swapAssetFrom.balance.decimals
            )
          );
          if (swapAssetFrom.balance.amount.isLessThan(valueInFractionalUnit)) return false;
          return true;
        },
      })
      .required(FormErrorMessages.AmountRequired)
      .typeError(FormErrorMessages.MustBeNumber)
      .positive(FormErrorMessages.MustBePositive),
    swapAmountTo: yup
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
