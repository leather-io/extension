import { useMemo } from 'react';

import { FormikHelpers } from 'formik';
import * as yup from 'yup';

import { STX_DECIMALS } from '@shared/constants';
import { logger } from '@shared/logger';
import { StacksSendFormValues } from '@shared/models/form.model';
import { createMoney } from '@shared/models/money.model';

import { convertAmountToBaseUnit } from '@app/common/money/calculate-money';
import { useWalletType } from '@app/common/use-wallet-type';
import {
  stxAmountValidator,
  stxAvailableBalanceValidator,
} from '@app/common/validation/forms/amount-validators';
import { stxFeeValidator } from '@app/common/validation/forms/fee-validators';
import { useLedgerNavigate } from '@app/features/ledger/hooks/use-ledger-navigate';
import { useUpdatePersistedSendFormValues } from '@app/features/popup-send-form-restoration/use-update-persisted-send-form-values';
import { useCurrentStacksAccountAnchoredBalances } from '@app/query/stacks/balance/stx-balance.hooks';
import { useCalculateStacksTxFees } from '@app/query/stacks/fees/fees.hooks';
import { useCurrentAccountMempoolTransactionsBalance } from '@app/query/stacks/mempool/mempool.hooks';
import {
  useGenerateStxTokenTransferUnsignedTx,
  useStxTokenTransferUnsignedTxState,
} from '@app/store/transactions/token-transfer.hooks';

import { useSendFormNavigate } from '../../hooks/use-send-form-navigate';
import { useStacksCommonSendForm } from '../stacks/use-stacks-common-send-form';

export function useStxSendForm() {
  const { data: balances } = useCurrentStacksAccountAnchoredBalances();
  const unsignedTx = useStxTokenTransferUnsignedTxState();
  const { data: stxFees } = useCalculateStacksTxFees(unsignedTx);

  const generateTx = useGenerateStxTokenTransferUnsignedTx();
  const pendingTxsBalance = useCurrentAccountMempoolTransactionsBalance();
  const { onFormStateChange } = useUpdatePersistedSendFormValues();

  const { whenWallet } = useWalletType();
  const ledgerNavigate = useLedgerNavigate();
  const sendFormNavigate = useSendFormNavigate();

  const availableStxBalance = balances?.stx.availableStx ?? createMoney(0, 'STX');

  const sendMaxBalance = useMemo(
    () =>
      convertAmountToBaseUnit(
        availableStxBalance.amount
          .minus(pendingTxsBalance.amount)
          .minus(stxFees?.estimates[1].fee.amount || 0),
        STX_DECIMALS
      ),
    [availableStxBalance, pendingTxsBalance, stxFees]
  );

  const { initialValues, checkFormValidation, recipient, memo, nonce } = useStacksCommonSendForm({
    symbol: 'STX',
    availableTokenBalance: availableStxBalance,
  });

  return {
    availableStxBalance,
    initialValues,
    onFormStateChange,
    sendMaxBalance,
    stxFees,

    validationSchema: yup.object({
      amount: stxAmountValidator().concat(stxAvailableBalanceValidator(availableStxBalance)),
      fee: stxFeeValidator(availableStxBalance),
      recipient,
      memo,
      nonce,
    }),

    async previewTransaction(
      values: StacksSendFormValues,
      formikHelpers: FormikHelpers<StacksSendFormValues>
    ) {
      const isFormValid = await checkFormValidation(values, formikHelpers);
      if (!isFormValid) return;

      const tx = await generateTx(values);
      if (!tx) return logger.error('Attempted to generate unsigned tx, but tx is undefined');

      whenWallet({
        software: () => sendFormNavigate.toConfirmAndSignStxTransaction(tx),
        ledger: () => ledgerNavigate.toConnectAndSignTransactionStep(tx),
      })();
    },
  };
}
