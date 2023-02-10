import { useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { Form, Formik, FormikHelpers } from 'formik';
import * as yup from 'yup';

import { HIGH_FEE_AMOUNT_STX, STX_DECIMALS } from '@shared/constants';
import { logger } from '@shared/logger';
import { FeeTypes } from '@shared/models/fees/_fees.model';
import { StacksSendFormValues } from '@shared/models/form.model';
import { createMoney } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';
import { isEmpty, isUndefined } from '@shared/utils';

import { FormErrorMessages } from '@app/common/error-messages';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { convertAmountToBaseUnit } from '@app/common/money/calculate-money';
import { useWalletType } from '@app/common/use-wallet-type';
import { stxAmountValidator } from '@app/common/validation/forms/amount-validators';
import { stxFeeValidator } from '@app/common/validation/forms/fee-validators';
import { stxMemoValidator } from '@app/common/validation/forms/memo-validators';
import {
  stxRecipientAddressOrBnsNameValidator,
  stxRecipientValidator,
} from '@app/common/validation/forms/recipient-validators';
import { nonceValidator } from '@app/common/validation/nonce-validators';
import { StxAvatar } from '@app/components/crypto-assets/stacks/components/stx-avatar';
import { EditNonceButton } from '@app/components/edit-nonce-button';
import { FeesRow } from '@app/components/fees-row/fees-row';
import { NonceSetter } from '@app/components/nonce-setter';
import { HighFeeDrawer } from '@app/features/high-fee-drawer/high-fee-drawer';
import { useLedgerNavigate } from '@app/features/ledger/hooks/use-ledger-navigate';
import { useCurrentStacksAccountAnchoredBalances } from '@app/query/stacks/balance/balance.hooks';
import { useCalculateStacksTxFees } from '@app/query/stacks/fees/fees.hooks';
import { useCurrentAccountMempoolTransactionsBalance } from '@app/query/stacks/mempool/mempool.hooks';
import { useNextNonce } from '@app/query/stacks/nonce/account-nonces.hooks';
import { useCurrentAccountStxAddressState } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useStacksClientUnanchored } from '@app/store/common/api-clients.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';
import {
  useGenerateStxTokenTransferUnsignedTx,
  useStxTokenTransferUnsignedTxState,
} from '@app/store/transactions/token-transfer.hooks';

import { AmountField } from '../../components/amount-field';
import { FormErrors } from '../../components/form-errors';
import { FormFieldsLayout } from '../../components/form-fields.layout';
import { MemoField } from '../../components/memo-field';
import { PreviewButton } from '../../components/preview-button';
import { SelectedAssetField } from '../../components/selected-asset-field';
import { SendAllButton } from '../../components/send-all-button';
import { StacksRecipientField } from '../../family/stacks/components/stacks-recipient-field';
import { useSendFormNavigate } from '../../hooks/use-send-form-navigate';
import { createDefaultInitialFormValues } from '../../send-form.utils';

export function StxCryptoCurrencySendForm() {
  const navigate = useNavigate();
  const { isShowingHighFeeConfirmation, setIsShowingHighFeeConfirmation } = useDrawers();
  const { data: nextNonce } = useNextNonce();
  const unsignedTx = useStxTokenTransferUnsignedTxState();
  const { data: stxFees } = useCalculateStacksTxFees(unsignedTx);
  const { data: balances } = useCurrentStacksAccountAnchoredBalances();
  const generateTx = useGenerateStxTokenTransferUnsignedTx();
  const pendingTxsBalance = useCurrentAccountMempoolTransactionsBalance();
  const currentAccountStxAddress = useCurrentAccountStxAddressState();
  const currentNetwork = useCurrentNetworkState();
  const { whenWallet } = useWalletType();
  const client = useStacksClientUnanchored();
  const ledgerNavigate = useLedgerNavigate();
  const sendFormNavigate = useSendFormNavigate();

  const availableStxBalance = balances?.stx.availableStx ?? createMoney(0, 'STX');
  const sendAllBalance = useMemo(
    () =>
      convertAmountToBaseUnit(
        availableStxBalance.amount.minus(pendingTxsBalance.amount),
        STX_DECIMALS
      ),
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
    amount: stxAmountValidator(availableStxBalance),
    recipient: stxRecipientValidator(currentAccountStxAddress, currentNetwork),
    recipientAddressOrBnsName: stxRecipientAddressOrBnsNameValidator({
      client,
      currentAddress: currentAccountStxAddress,
      currentNetwork,
    }),
    memo: stxMemoValidator(FormErrorMessages.MemoExceedsLimit),
    fee: stxFeeValidator(availableStxBalance),
    nonce: nonceValidator,
  });

  async function previewTransaction(
    values: StacksSendFormValues,
    formikHelpers: FormikHelpers<StacksSendFormValues>
  ) {
    // Validate and check high fee warning first
    const formErrors = await formikHelpers.validateForm();
    if (!isShowingHighFeeConfirmation && isEmpty(formErrors) && values.fee > HIGH_FEE_AMOUNT_STX) {
      return setIsShowingHighFeeConfirmation(true);
    }

    const tx = await generateTx(values);
    if (!tx) return logger.error('Attempted to generate unsigned tx, but tx is undefined');

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
        <NonceSetter>
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
              <SelectedAssetField icon={<StxAvatar />} name="Stacks" symbol="STX" />
              <StacksRecipientField />
              <MemoField lastChild />
            </FormFieldsLayout>
            <FeesRow fees={stxFees} isSponsored={false} mt="base" />
            <FormErrors />
            <PreviewButton
              isDisabled={
                !(
                  props.values.amount &&
                  props.values.recipient &&
                  props.values.fee &&
                  !isUndefined(props.values.nonce)
                )
              }
            />
            <EditNonceButton
              onEditNonce={() => navigate(RouteUrls.EditNonce)}
              my={['loose', 'base']}
            />
            <HighFeeDrawer />
            <Outlet />
          </Form>
        </NonceSetter>
      )}
    </Formik>
  );
}
