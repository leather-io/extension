import BigNumber from 'bignumber.js';
import { FormikHelpers } from 'formik';

import { HIGH_FEE_AMOUNT_STX } from '@shared/constants';
import { FeeTypes } from '@shared/models/fees/fees.model';
import { StacksSendFormValues } from '@shared/models/form.model';
import { Money } from '@shared/models/money.model';
import { isEmpty } from '@shared/utils';

import { FormErrorMessages } from '@app/common/error-messages';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { stxMemoValidator } from '@app/common/validation/forms/memo-validators';
import { stxRecipientValidator } from '@app/common/validation/forms/recipient-validators';
import { nonceValidator } from '@app/common/validation/nonce-validators';
import { useNextNonce } from '@app/query/stacks/nonce/account-nonces.hooks';
import { useCurrentAccountStxAddressState } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { useSendFormRouteState } from '../../hooks/use-send-form-route-state';
import { createDefaultInitialFormValues } from '../../send-form.utils';

interface UseStacksCommonSendFormArgs {
  symbol: string;
  availableTokenBalance: Money;
}

export function useStacksCommonSendForm({
  symbol,
  availableTokenBalance,
}: UseStacksCommonSendFormArgs) {
  const routeState = useSendFormRouteState();
  const { data: nextNonce } = useNextNonce();
  const { isShowingHighFeeConfirmation, setIsShowingHighFeeConfirmation } = useDrawers();
  const currentAccountStxAddress = useCurrentAccountStxAddressState();
  const currentNetwork = useCurrentNetworkState();

  const initialValues: StacksSendFormValues = createDefaultInitialFormValues({
    fee: '',
    feeCurrency: 'STX',
    feeType: FeeTypes[FeeTypes.Unknown],
    memo: '',
    nonce: nextNonce?.nonce,
    recipientBnsName: '',
    symbol,
    ...routeState,
  });

  async function checkFormValidation(
    values: StacksSendFormValues,
    formikHelpers: FormikHelpers<StacksSendFormValues>
  ) {
    // Validate and check high fee warning first
    const formErrors = formikHelpers.validateForm();
    if (
      !isShowingHighFeeConfirmation &&
      isEmpty(formErrors) &&
      new BigNumber(values.fee).isGreaterThan(HIGH_FEE_AMOUNT_STX)
    ) {
      setIsShowingHighFeeConfirmation(true);
      return false;
    }
    return true;
  }

  return {
    initialValues,
    availableTokenBalance,
    checkFormValidation,
    recipient: stxRecipientValidator(currentAccountStxAddress, currentNetwork),
    memo: stxMemoValidator(FormErrorMessages.MemoExceedsLimit),
    nonce: nonceValidator,
  };
}
