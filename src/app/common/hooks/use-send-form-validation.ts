import { useCallback, useMemo } from 'react';

import * as yup from 'yup';

import { STX_DECIMALS } from '@shared/constants';
import { createMoney } from '@shared/models/money.model';
import { isNumber } from '@shared/utils';

import { formatInsufficientBalanceError, formatPrecisionError } from '@app/common/error-formatters';
import { SendFormErrorMessages } from '@app/common/error-messages';
import { useSelectedAssetBalance } from '@app/common/hooks/use-selected-asset-balance';
import { useWallet } from '@app/common/hooks/use-wallet';
import { makeStacksFungibleTokenSchema } from '@app/common/validation/amount-schema';
import { stxAmountSchema } from '@app/common/validation/currency-schema';
import { nonceSchema } from '@app/common/validation/nonce-schema';
import {
  stxAddressNetworkValidatorFactory,
  stxAddressSchema,
  stxNotCurrentAddressValidatorFactory,
} from '@app/common/validation/stx-address-schema';
import { useFeeSchema } from '@app/common/validation/use-fee-schema';
import { transactionMemoSchema } from '@app/common/validation/validate-memo';
import { useCurrentStacksAccountAnchoredBalances } from '@app/query/stacks/balance/balance.hooks';
import { useStacksClientUnanchored } from '@app/store/common/api-clients.hooks';

import { stxToMicroStx } from '../money/unit-conversion';

export function useFungibleTokenAmountSchema(selectedAssetId: string) {
  const { selectedAssetBalance } = useSelectedAssetBalance(selectedAssetId);
  return useCallback(
    () => makeStacksFungibleTokenSchema(selectedAssetBalance?.balance ?? createMoney(0, 'STX')),
    [selectedAssetBalance]
  );
}

interface UseSendFormValidationArgs {
  selectedAssetId: string;
  setAssetError(error: string | undefined): void;
}
export const useStacksSendFormValidation = ({
  selectedAssetId,
  setAssetError,
}: UseSendFormValidationArgs) => {
  const { currentNetwork, currentAccountStxAddress } = useWallet();
  const { data: stacksBalances } = useCurrentStacksAccountAnchoredBalances();
  const { isStx, selectedAssetBalance } = useSelectedAssetBalance(selectedAssetId);
  const fungibleTokenSchema = useFungibleTokenAmountSchema(selectedAssetId);
  const feeSchema = useFeeSchema();
  const client = useStacksClientUnanchored();

  // TODO: Can this be removed?
  const selectedAssetSchema = useCallback(
    () =>
      yup.mixed().test(() => {
        if (!selectedAssetBalance) {
          setAssetError(SendFormErrorMessages.MustSelectAsset);
        } else {
          setAssetError(undefined);
        }
        return !!selectedAssetBalance;
      }),
    [selectedAssetBalance, setAssetError]
  );

  const stxAmountFormSchema = useCallback(
    () =>
      stxAmountSchema(formatPrecisionError('STX', STX_DECIMALS)).test({
        message: formatInsufficientBalanceError(stacksBalances?.stx.availableStx.amount, 'STX'),
        test(value: unknown) {
          const fee = stxToMicroStx(this.parent.fee);
          if (!stacksBalances || !isNumber(value)) return false;
          const availableBalanceLessFee = stacksBalances?.stx.availableStx.amount.minus(fee);
          return availableBalanceLessFee.isGreaterThanOrEqualTo(stxToMicroStx(value));
        },
      }),
    [stacksBalances]
  );

  const amountSchema = useCallback(
    () =>
      yup
        .number()
        .required()
        .positive(SendFormErrorMessages.MustNotBeZero)
        .concat(isStx ? stxAmountFormSchema() : fungibleTokenSchema()),
    [fungibleTokenSchema, isStx, stxAmountFormSchema]
  );

  const addressSchema = stxAddressSchema(SendFormErrorMessages.InvalidAddress)
    .test({
      message: SendFormErrorMessages.IncorrectAddressMode,
      test: stxAddressNetworkValidatorFactory(currentNetwork),
    })
    .test({
      message: SendFormErrorMessages.SameAddress,
      test: stxNotCurrentAddressValidatorFactory(currentAccountStxAddress || ''),
    });

  const recipientAddressOrBnsNameSchema = yup.string().test({
    name: 'recipientAddressOrBnsName',
    test: async value => {
      try {
        await addressSchema.validate(value);
        return true;
      } catch (e) {}
      try {
        const res = await client.namesApi.getNameInfo({ name: value ?? '' });
        if (typeof res.address !== 'string' || res.address.length === 0) return false;
        return true;
      } catch (e) {
        return false;
      }
    },
  });

  const recipientSchema = addressSchema;

  return useMemo(
    () =>
      yup.object({
        amount: amountSchema(),
        fee: feeSchema(),
        memo: transactionMemoSchema(SendFormErrorMessages.MemoExceedsLimit),
        nonce: nonceSchema,
        recipient: recipientSchema,
        recipientAddressOrBnsName: recipientAddressOrBnsNameSchema,
        selectedAsset: selectedAssetSchema(),
      }),
    [recipientAddressOrBnsNameSchema, amountSchema, feeSchema, recipientSchema, selectedAssetSchema]
  );
};
