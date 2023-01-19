import { useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { Form, Formik, FormikHelpers } from 'formik';
import * as yup from 'yup';

import { logger } from '@shared/logger';
import { FeeTypes } from '@shared/models/fees/_fees.model';
import { StacksSendFormValues } from '@shared/models/form.model';
import { createMoney } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';

import { formatPrecisionError } from '@app/common/error-formatters';
import { FormErrorMessages } from '@app/common/error-messages';
import { convertAmountToBaseUnit } from '@app/common/money/calculate-money';
import { useWalletType } from '@app/common/use-wallet-type';
import { stxAddressValidator } from '@app/common/validation/forms/address-validators';
import { stxAmountValidator } from '@app/common/validation/forms/currency-validators';
import { stxFeeValidator } from '@app/common/validation/forms/fee-validators';
import { stxMemoValidator } from '@app/common/validation/forms/memo-validators';
import { nonceValidator } from '@app/common/validation/nonce-validators';
import { StxAvatar } from '@app/components/crypto-assets/stacks/components/stx-avatar';
import { EditNonceButton } from '@app/components/edit-nonce-button';
import { FeesRow } from '@app/components/fees-row/fees-row';
import { HighFeeDrawer } from '@app/features/high-fee-drawer/high-fee-drawer';
import { useLedgerNavigate } from '@app/features/ledger/hooks/use-ledger-navigate';
import { useCurrentStacksAccountAnchoredBalances } from '@app/query/stacks/balance/balance.hooks';
import { useCalculateStacksTxFees } from '@app/query/stacks/fees/fees.hooks';
import { useCurrentAccountMempoolTransactionsBalance } from '@app/query/stacks/mempool/mempool.hooks';
import { useNextNonce } from '@app/query/stacks/nonce/account-nonces.hooks';
import {
  useGenerateStxTokenTransferUnsignedTx,
  useStxTokenTransferUnsignedTxState,
} from '@app/store/transactions/token-transfer.hooks';

import { AmountField } from '../_components/amount-field';
import { FormErrors } from '../_components/form-errors';
import { FormFieldsLayout } from '../_components/form-fields.layout';
import { MemoField } from '../_components/memo-field';
import { PreviewButton } from '../_components/preview-button';
import { RecipientField } from '../_components/recipient-field';
import { SelectedAssetField } from '../_components/selected-asset-field';
import { SendAllButton } from '../_components/send-all-button';
import { useHighFeeWarning } from '../_hooks/use-high-fee-warning';
import { useSendFormNavigate } from '../_hooks/use-send-form-navigate';
import { createDefaultInitialFormValues } from '../send-form.utils';

export function StxCryptoCurrencySendForm() {
  const navigate = useNavigate();
  const shouldFormShowHighFeeWarning = useHighFeeWarning();
  const { data: nextNonce } = useNextNonce();
  const unsignedTx = useStxTokenTransferUnsignedTxState();
  const { data: stxFees } = useCalculateStacksTxFees(unsignedTx);
  const { data: balances } = useCurrentStacksAccountAnchoredBalances();
  const generateTx = useGenerateStxTokenTransferUnsignedTx();
  const pendingTxsBalance = useCurrentAccountMempoolTransactionsBalance();
  const { whenWallet } = useWalletType();
  const ledgerNavigate = useLedgerNavigate();
  const sendFormNavigate = useSendFormNavigate();

  const availableStxBalance = balances?.stx.availableStx ?? createMoney(0, 'STX');
  const sendAllBalance = useMemo(
    () => convertAmountToBaseUnit(availableStxBalance).minus(pendingTxsBalance),
    [availableStxBalance, pendingTxsBalance]
  );

  const initialValues: StacksSendFormValues = createDefaultInitialFormValues({
    amount: '',
    fee: '',
    feeCurrency: 'STX',
    feeType: FeeTypes[FeeTypes.Unknown],
    memo: '',
    nonce: nextNonce?.nonce,
    recipient: '',
    recipientAddressOrBnsName: '',
    symbol: '',
  });

  const validationSchema = yup.object({
    amount: stxAmountValidator(formatPrecisionError(availableStxBalance)),
    recipient: stxAddressValidator(FormErrorMessages.InvalidAddress),
    memo: stxMemoValidator(FormErrorMessages.MemoExceedsLimit),
    fee: stxFeeValidator(availableStxBalance),
    nonce: nonceValidator,
  });

  async function previewTransaction(
    values: StacksSendFormValues,
    formikHelpers: FormikHelpers<StacksSendFormValues>
  ) {
    // Validate and check high fee warning first
    const formErrors = formikHelpers.validateForm();
    shouldFormShowHighFeeWarning(formErrors, values);

    const tx = await generateTx(values);
    if (!tx) return logger.error('Attempted to sign tx, but no tx exists');
    whenWallet({
      software: () => sendFormNavigate.toConfirmAndSignStxTransaction(tx),
      ledger: () => ledgerNavigate.toConnectAndSignTransactionStep(tx),
    })();
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values, formikHelpers) => await previewTransaction(values, formikHelpers)}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
      validationSchema={validationSchema}
    >
      {props => (
        <Form style={{ width: '100%' }}>
          <AmountField
            balance={availableStxBalance}
            bottomInputOverlay={
              <SendAllButton
                balance={availableStxBalance}
                sendAllBalance={sendAllBalance.minus(props.values.fee).toString()}
              />
            }
          />
          <FormFieldsLayout>
            <SelectedAssetField
              icon={<StxAvatar />}
              name="Stacks"
              onClickAssetGoBack={() => navigate(RouteUrls.SendCryptoAsset)}
              symbol="STX"
            />
            <RecipientField />
            <MemoField lastChild />
          </FormFieldsLayout>
          <FeesRow fees={stxFees} isSponsored={false} mt="base" />
          <FormErrors />
          <PreviewButton />
          <EditNonceButton
            onEditNonce={() => navigate(RouteUrls.EditNonce)}
            my={['loose', 'base']}
          />
          <HighFeeDrawer />
          <Outlet />
        </Form>
      )}
    </Formik>
  );
}
