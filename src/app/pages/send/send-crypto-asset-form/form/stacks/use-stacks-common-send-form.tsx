import BigNumber from 'bignumber.js';
import { FormikHelpers } from 'formik';

import { FeeTypes, type Money } from '@leather-wallet/models';
import { useNextNonce } from '@leather-wallet/query';
import { isEmpty } from '@leather-wallet/utils';

import { HIGH_FEE_AMOUNT_STX } from '@shared/constants';
import { FormErrorMessages } from '@shared/error-messages';
import { StacksSendFormValues } from '@shared/models/form.model';

import { stxMemoValidator } from '@app/common/validation/forms/memo-validators';
import { stxRecipientValidator } from '@app/common/validation/forms/recipient-validators';
import { nonceValidator } from '@app/common/validation/nonce-validators';
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
    if (isEmpty(formErrors) && new BigNumber(values.fee).isGreaterThan(HIGH_FEE_AMOUNT_STX)) {
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
