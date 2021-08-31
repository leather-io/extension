import * as yup from 'yup';
import BigNumber from 'bignumber.js';
import { useWallet } from '@common/hooks/use-wallet';
import { useSelectedAsset } from '@common/hooks/use-selected-asset';
import { STX_DECIMALS, STX_TRANSFER_TX_SIZE_BYTES } from '@common/constants';
import { useCurrentAccountAvailableStxBalance } from '@store/accounts/account.hooks';
import { countDecimals, isNumber } from '@common/utils';
import { transactionMemoSchema } from '@common/validation/validate-memo';
import { stxToMicroStx } from '@stacks/ui-utils';
import { stxAmountSchema } from '@common/validation/currency-schema';
import {
  stxAddressNetworkValidatorFactory,
  stxAddressSchema,
  stxNotCurrentAddressValidatorFactory,
} from '@common/validation/stx-address-schema';
import { useCallback, useMemo } from 'react';
import { SendFormErrorMessages } from '@common/error-messages';
import { formatInsufficientBalanceError, formatPrecisionError } from '@common/error-formatters';

interface UseSendFormValidationArgs {
  setAssetError(error: string): void;
}
export const useSendFormValidation = ({ setAssetError }: UseSendFormValidationArgs) => {
  const { currentNetwork, currentAccountStxAddress } = useWallet();
  const availableStxBalance = useCurrentAccountAvailableStxBalance();
  const { selectedAsset, balanceBigNumber } = useSelectedAsset();
  const isSendingStx = selectedAsset?.type === 'stx';

  // `selectedAsset` is in an atom's state, not the form, but we want to
  // validate it at the same time, to call `setAssetError`. This is a dummy
  // schema that we use to call this function at the same time as the rest
  // of the form is validated
  const selectedAssetSchema = useCallback(
    () =>
      yup.mixed().test(() => {
        if (!selectedAsset) setAssetError(SendFormErrorMessages.MustSelectAsset);
        return !!selectedAsset;
      }),
    [selectedAsset, setAssetError]
  );

  const stxAmountFormSchema = useCallback(
    () =>
      stxAmountSchema(formatPrecisionError('STX', STX_DECIMALS)).test({
        message: formatInsufficientBalanceError(availableStxBalance, 'STX'),
        test(value: unknown) {
          if (!availableStxBalance || !isNumber(value)) return false;
          const availableBalanceLessFee = availableStxBalance.minus(STX_TRANSFER_TX_SIZE_BYTES);
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
        selectedAsset: selectedAssetSchema(),
        recipient: recipientSchema(),
        amount: amountSchema(),
        memo: transactionMemoSchema(SendFormErrorMessages.MemoExceedsLimit),
      }),
    [amountSchema, recipientSchema, selectedAssetSchema]
  );
};
