import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { FeeTypes } from '@leather-wallet/models';
import { type SwapAsset, useNextNonce } from '@leather-wallet/query';
import { convertAmountToFractionalUnit, createMoney } from '@leather-wallet/utils';

import { FormErrorMessages } from '@shared/error-messages';
import { StacksTransactionFormValues } from '@shared/models/form.model';

import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { useSwapContext } from '../swap.context';

export interface SwapFormValues extends StacksTransactionFormValues {
  swapAmountBase: string;
  swapAmountQuote: string;
  swapAssetBase?: SwapAsset;
  swapAssetQuote?: SwapAsset;
}

export function useSwapForm() {
  const { isFetchingExchangeRate } = useSwapContext();
  const stxAddress = useCurrentStacksAccountAddress();
  const { data: nextNonce } = useNextNonce(stxAddress);

  const initialValues: SwapFormValues = {
    fee: '0',
    feeCurrency: 'STX',
    feeType: FeeTypes[FeeTypes.Middle],
    nonce: nextNonce?.nonce,
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
