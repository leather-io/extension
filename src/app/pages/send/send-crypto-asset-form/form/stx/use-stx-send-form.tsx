import { useMemo } from 'react';

import { FormikHelpers } from 'formik';
import * as yup from 'yup';

import { HIGH_FEE_AMOUNT_STX, STX_DECIMALS } from '@shared/constants';
import { logger } from '@shared/logger';
import { FeeTypes } from '@shared/models/fees/_fees.model';
import { StacksSendFormValues } from '@shared/models/form.model';
import { createMoney } from '@shared/models/money.model';
import { isEmpty } from '@shared/utils';

import { FormErrorMessages } from '@app/common/error-messages';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { convertAmountToBaseUnit } from '@app/common/money/calculate-money';
import { useWalletType } from '@app/common/use-wallet-type';
import {
  stxAmountValidator,
  stxAvailableBalanceValidator,
} from '@app/common/validation/forms/amount-validators';
import { stxFeeValidator } from '@app/common/validation/forms/fee-validators';
import { stxMemoValidator } from '@app/common/validation/forms/memo-validators';
import { stxRecipientValidator } from '@app/common/validation/forms/recipient-validators';
import { nonceValidator } from '@app/common/validation/nonce-validators';
import { useLedgerNavigate } from '@app/features/ledger/hooks/use-ledger-navigate';
import { useUpdatePersistedSendFormValues } from '@app/features/popup-send-form-restoration/use-update-persisted-send-form-values';
import { useCurrentStacksAccountAnchoredBalances } from '@app/query/stacks/balance/stx-balance.hooks';
import { useCalculateStacksTxFees } from '@app/query/stacks/fees/fees.hooks';
import { useCurrentAccountMempoolTransactionsBalance } from '@app/query/stacks/mempool/mempool.hooks';
import { useNextNonce } from '@app/query/stacks/nonce/account-nonces.hooks';
import { useCurrentAccountStxAddressState } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';
import {
  useGenerateStxTokenTransferUnsignedTx,
  useStxTokenTransferUnsignedTxState,
} from '@app/store/transactions/token-transfer.hooks';

import { useSendFormNavigate } from '../../hooks/use-send-form-navigate';
import { useSendFormRouteState } from '../../hooks/use-send-form-route-state';
import { createDefaultInitialFormValues } from '../../send-form.utils';

export function useStxSendForm() {
  const routeState = useSendFormRouteState();
  const { isShowingHighFeeConfirmation, setIsShowingHighFeeConfirmation } = useDrawers();
  const { data: nextNonce } = useNextNonce();
  const generateTx = useGenerateStxTokenTransferUnsignedTx();
  const currentAccountStxAddress = useCurrentAccountStxAddressState();
  const { data: balances } = useCurrentStacksAccountAnchoredBalances();
  const pendingTxsBalance = useCurrentAccountMempoolTransactionsBalance();
  const unsignedTx = useStxTokenTransferUnsignedTxState();
  const { data: stxFees } = useCalculateStacksTxFees(unsignedTx);
  const currentNetwork = useCurrentNetworkState();
  const { onFormStateChange } = useUpdatePersistedSendFormValues();

  const { whenWallet } = useWalletType();
  const ledgerNavigate = useLedgerNavigate();
  const sendFormNavigate = useSendFormNavigate();

  const availableStxBalance = balances?.stx.availableStx ?? createMoney(0, 'STX');

  const sendMaxBalance = useMemo(
    () =>
      convertAmountToBaseUnit(
        availableStxBalance.amount.minus(pendingTxsBalance.amount),
        STX_DECIMALS
      ),
    [availableStxBalance, pendingTxsBalance]
  );

  const initialValues: StacksSendFormValues = createDefaultInitialFormValues({
    fee: '',
    feeCurrency: 'STX',
    feeType: FeeTypes[FeeTypes.Unknown],
    memo: '',
    nonce: nextNonce?.nonce,
    recipientBnsName: '',
    ...routeState,
  });

  return {
    availableStxBalance,
    initialValues,
    onFormStateChange,
    sendMaxBalance,
    stxFees,

    validationSchema: yup.object({
      amount: stxAmountValidator().concat(stxAvailableBalanceValidator(availableStxBalance)),
      recipient: stxRecipientValidator(currentAccountStxAddress, currentNetwork),
      memo: stxMemoValidator(FormErrorMessages.MemoExceedsLimit),
      fee: stxFeeValidator(availableStxBalance),
      nonce: nonceValidator,
    }),

    async previewTransaction(
      values: StacksSendFormValues,
      formikHelpers: FormikHelpers<StacksSendFormValues>
    ) {
      // Validate and check high fee warning first
      const formErrors = await formikHelpers.validateForm();
      if (
        !isShowingHighFeeConfirmation &&
        isEmpty(formErrors) &&
        values.fee > HIGH_FEE_AMOUNT_STX
      ) {
        return setIsShowingHighFeeConfirmation(true);
      }

      const tx = await generateTx(values);
      if (!tx) return logger.error('Attempted to generate unsigned tx, but tx is undefined');

      whenWallet({
        software: () => sendFormNavigate.toConfirmAndSignStxTransaction(tx),
        ledger: () => ledgerNavigate.toConnectAndSignTransactionStep(tx),
      })();
    },
  };
}
