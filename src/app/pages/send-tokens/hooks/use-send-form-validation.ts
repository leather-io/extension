import * as yup from 'yup';
import BigNumber from 'bignumber.js';
import { stxToMicroStx } from '@stacks/ui-utils';

import { useWallet } from '@app/common/hooks/use-wallet';
import { STX_DECIMALS } from '@shared/constants';
import { countDecimals, isNumber } from '@app/common/utils';
import { transactionMemoSchema } from '@app/common/validation/validate-memo';
import { stxAmountSchema } from '@app/common/validation/currency-schema';
import {
  stxAddressNetworkValidatorFactory,
  stxAddressSchema,
  stxNotCurrentAddressValidatorFactory,
} from '@app/common/validation/stx-address-schema';
import { useCallback, useMemo } from 'react';
import { SendFormErrorMessages } from '@app/common/error-messages';
import { formatInsufficientBalanceError, formatPrecisionError } from '@app/common/error-formatters';
import { useFeeSchema } from '@app/common/validation/use-fee-schema';
import { useSelectedAsset } from '@app/pages/send-tokens/hooks/use-selected-asset';
import { useCurrentAccountAvailableStxBalance } from '@app/store/accounts/account.hooks';
import { nonceSchema } from '@app/common/validation/nonce-schema';

interface UseSendFormValidationArgs {
  setAssetError(error: string | undefined): void;
}
export const useSendFormValidation = ({ setAssetError }: UseSendFormValidationArgs) => {
  const { currentNetwork, currentAccountStxAddress } = useWallet();
  const availableStxBalance = useCurrentAccountAvailableStxBalance();
  const { selectedAsset, balanceBigNumber } = useSelectedAsset();
  const feeSchema = useFeeSchema();
  const isSendingStx = selectedAsset?.type === 'stx';

  // `selectedAsset` is in an atom's state, not the form, but we want to
  // validate it at the same time, to call `setAssetError`. This is a dummy
  // schema that we use to call this function at the same time as the rest
  // of the form is validated
  const selectedAssetSchema = useCallback(
    () =>
      yup.mixed().test(() => {
        if (!selectedAsset) {
          setAssetError(SendFormErrorMessages.MustSelectAsset);
        } else {
          setAssetError(undefined);
        }
        return !!selectedAsset;
      }),
    [selectedAsset, setAssetError]
  );

  const stxAmountFormSchema = useCallback(
    () =>
      stxAmountSchema(formatPrecisionError('STX', STX_DECIMALS)).test({
        message: formatInsufficientBalanceError(availableStxBalance, 'STX'),
        test(value: unknown) {
          const fee = stxToMicroStx(this.parent.fee);
          if (!availableStxBalance || !isNumber(value)) return false;
          const availableBalanceLessFee = availableStxBalance.minus(fee);
          return availableBalanceLessFee.isGreaterThanOrEqualTo(stxToMicroStx(value));
        },
      }),
    [availableStxBalance]
  );

  const fungibleTokenSchema = useCallback(
    () =>
      yup
        .number()
        .test((value: unknown, context) => {
          if (!isNumber(value) || !selectedAsset || !selectedAsset.meta) return false;
          if (!selectedAsset.meta.decimals && countDecimals(value) > 0)
            return context.createError({
              message: SendFormErrorMessages.DoesNotSupportDecimals,
            });
          if (countDecimals(value) > selectedAsset.meta.decimals) {
            const { symbol, decimals } = selectedAsset.meta;
            return context.createError({ message: formatPrecisionError(symbol, decimals) });
          }
          return true;
        })
        .test({
          message: formatInsufficientBalanceError(balanceBigNumber, selectedAsset?.meta?.symbol),
          test(value: unknown) {
            if (!isNumber(value) || !balanceBigNumber) return false;
            return new BigNumber(value).isLessThanOrEqualTo(balanceBigNumber);
          },
        }),
    [balanceBigNumber, selectedAsset]
  );

  const amountSchema = useCallback(
    () =>
      yup
        .number()
        .required()
        .positive(SendFormErrorMessages.MustNotBeZero)
        .concat(isSendingStx ? stxAmountFormSchema() : fungibleTokenSchema()),
    [fungibleTokenSchema, isSendingStx, stxAmountFormSchema]
  );

  const recipientSchema = useCallback(
    () =>
      stxAddressSchema(SendFormErrorMessages.InvalidAddress)
        .test({
          message: SendFormErrorMessages.IncorrectAddressMode,
          test: stxAddressNetworkValidatorFactory(currentNetwork),
        })
        .test({
          message: SendFormErrorMessages.SameAddress,
          test: stxNotCurrentAddressValidatorFactory(currentAccountStxAddress || ''),
        }),
    [currentAccountStxAddress, currentNetwork]
  );

  return useMemo(
    () =>
      yup.object({
        amount: amountSchema(),
        fee: feeSchema(),
        memo: transactionMemoSchema(SendFormErrorMessages.MemoExceedsLimit),
        nonce: nonceSchema,
        recipient: recipientSchema(),
        selectedAsset: selectedAssetSchema(),
      }),
    [amountSchema, feeSchema, recipientSchema, selectedAssetSchema]
  );
};
