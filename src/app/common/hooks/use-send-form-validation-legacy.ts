import { useCallback, useMemo } from 'react';

import * as yup from 'yup';

import { createMoney } from '@shared/models/money.model';
import { isNumber } from '@shared/utils';

import { formatInsufficientBalanceError, formatPrecisionError } from '@app/common/error-formatters';
import { FormErrorMessages } from '@app/common/error-messages';
import { useSelectedAssetBalance } from '@app/common/hooks/use-selected-asset-balance';
import {
  stxAddressNetworkValidatorFactory,
  stxAddressValidator,
  stxNotCurrentAddressValidatorFactory,
} from '@app/common/validation/forms/address-validators';
import { stxAmountValidator } from '@app/common/validation/forms/currency-validators';
import { stxMemoValidator } from '@app/common/validation/forms/memo-validators';
import { nonceValidator } from '@app/common/validation/nonce-validators';
import { useCurrentStacksAccountAnchoredBalances } from '@app/query/stacks/balance/balance.hooks';
import { useCurrentAccountStxAddressState } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useStacksClientUnanchored } from '@app/store/common/api-clients.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { microStxToStx, stxToMicroStx } from '../money/unit-conversion';
import { stacksFungibleTokenValidator } from '../validation/forms/amount-validators';
import { stxFeeValidator } from '../validation/forms/fee-validators';

function useFungibleTokenAmountSchema(selectedAssetId: string) {
  const { selectedAssetBalance } = useSelectedAssetBalance(selectedAssetId);
  return useCallback(
    () => stacksFungibleTokenValidator(selectedAssetBalance?.balance ?? createMoney(0, 'STX')),
    [selectedAssetBalance]
  );
}

interface UseSendFormValidationArgs {
  selectedAssetId: string;
  setAssetError(error: string | undefined): void;
}
// TODO: Remove legacy send form validation
export const useStacksSendFormValidationLegacy = ({
  selectedAssetId,
  setAssetError,
}: UseSendFormValidationArgs) => {
  const currentAccountStxAddress = useCurrentAccountStxAddressState();
  const currentNetwork = useCurrentNetworkState();
  const { data: stacksBalances } = useCurrentStacksAccountAnchoredBalances();
  const { isStx, selectedAssetBalance } = useSelectedAssetBalance(selectedAssetId);
  const fungibleTokenSchema = useFungibleTokenAmountSchema(selectedAssetId);
  const client = useStacksClientUnanchored();

  const availableStxBalance = stacksBalances?.stx.availableStx;

  // TODO: Can this be removed?
  const selectedAssetSchema = useCallback(
    () =>
      yup.mixed().test(() => {
        if (!selectedAssetBalance) {
          setAssetError(FormErrorMessages.MustSelectAsset);
        } else {
          setAssetError(undefined);
        }
        return !!selectedAssetBalance;
      }),
    [selectedAssetBalance, setAssetError]
  );

  const stxAmountFormSchema = useCallback(
    () =>
      stxAmountValidator(formatPrecisionError(availableStxBalance)).test({
        message: formatInsufficientBalanceError(availableStxBalance, sum =>
          microStxToStx(sum.amount).toString()
        ),
        test(value: unknown) {
          const fee = stxToMicroStx(this.parent.fee);
          if (!stacksBalances || !isNumber(value)) return false;
          const availableBalanceLessFee = stacksBalances?.stx.availableStx.amount.minus(fee);
          return availableBalanceLessFee.isGreaterThanOrEqualTo(stxToMicroStx(value));
        },
      }),
    [availableStxBalance, stacksBalances]
  );

  const amountValidator = useCallback(
    () =>
      yup
        .number()
        .required()
        .positive(FormErrorMessages.MustNotBeZero)
        .concat(isStx ? stxAmountFormSchema() : fungibleTokenSchema()),
    [fungibleTokenSchema, isStx, stxAmountFormSchema]
  );

  const addressValidator = stxAddressValidator(FormErrorMessages.InvalidAddress)
    .test({
      message: FormErrorMessages.IncorrectNetworkAddress,
      test: stxAddressNetworkValidatorFactory(currentNetwork),
    })
    .test({
      message: FormErrorMessages.SameAddress,
      test: stxNotCurrentAddressValidatorFactory(currentAccountStxAddress || ''),
    });

  const recipientAddressOrBnsNameValidator = yup.string().test({
    name: 'recipientAddressOrBnsName',
    test: async value => {
      try {
        await addressValidator.validate(value);
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

  const recipientValidator = addressValidator;

  return useMemo(
    () =>
      yup.object({
        amount: amountValidator(),
        fee: stxFeeValidator(availableStxBalance),
        memo: stxMemoValidator(FormErrorMessages.MemoExceedsLimit),
        nonce: nonceValidator,
        recipient: recipientValidator,
        recipientAddressOrBnsName: recipientAddressOrBnsNameValidator,
        selectedAsset: selectedAssetSchema(),
      }),
    [
      amountValidator,
      availableStxBalance,
      recipientValidator,
      recipientAddressOrBnsNameValidator,
      selectedAssetSchema,
    ]
  );
};
