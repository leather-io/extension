import { FormikHelpers } from 'formik';

import { FeeTypes, type Money } from '@leather.io/models';
import { useNextNonce } from '@leather.io/query';

import { FormErrorMessages } from '@shared/error-messages';
import { StacksSendFormValues } from '@shared/models/form.model';

import { stxMemoValidator } from '@app/common/validation/forms/memo-validators';
import { stxRecipientValidator } from '@app/common/validation/forms/recipient-validators';
import { nonceValidator } from '@app/common/validation/nonce-validators';
import { useStacksHighFeeWarningContext } from '@app/features/stacks-high-fee-warning/stacks-high-fee-warning-container';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
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
  const stxAddress = useCurrentStacksAccountAddress();
  const { data: nextNonce } = useNextNonce(stxAddress);
  const currentNetwork = useCurrentNetworkState();
  const { isHighFeeWithNoFormErrors, setShowHighFeeWarningSheet } =
    useStacksHighFeeWarningContext();

  const initialValues: StacksSendFormValues = createDefaultInitialFormValues({
    hasDismissedHighFeeWarning: false,
    isShowingHighFeeDiaglog: false,
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
    const formErrors = await formikHelpers.validateForm();

    if (isHighFeeWithNoFormErrors(formErrors, values.fee)) {
      setShowHighFeeWarningSheet(true);
      return false;
    }
    return true;
  }

  return {
    initialValues,
    availableTokenBalance,
    checkFormValidation,
    recipient: stxRecipientValidator(stxAddress, currentNetwork),
    memo: stxMemoValidator(FormErrorMessages.MemoExceedsLimit),
    nonce: nonceValidator,
  };
}
