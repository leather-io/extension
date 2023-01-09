import { Outlet, useNavigate } from 'react-router-dom';

import { Form, Formik, FormikHelpers } from 'formik';
import * as yup from 'yup';

import { logger } from '@shared/logger';
import { FeeTypes } from '@shared/models/fees/_fees.model';
import { StacksSendFormValues } from '@shared/models/form.model';
import { createMoney } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';

import { FormErrorMessages } from '@app/common/error-messages';
import { useWalletType } from '@app/common/use-wallet-type';
import { pullContractIdFromIdentity } from '@app/common/utils';
import { stxAddressValidator } from '@app/common/validation/forms/address-validators';
import { stacksFungibleTokenValidator } from '@app/common/validation/forms/amount-validators';
import { stxFeeValidator } from '@app/common/validation/forms/fee-validators';
import { stxMemoValidator } from '@app/common/validation/forms/memo-validators';
import { nonceValidator } from '@app/common/validation/nonce-validators';
import { StxAvatar } from '@app/components/crypto-assets/stacks/components/stx-avatar';
import { EditNonceButton } from '@app/components/edit-nonce-button';
import { FeesRow } from '@app/components/fees-row/fees-row';
import { HighFeeDrawer } from '@app/features/high-fee-drawer/high-fee-drawer';
import { useLedgerNavigate } from '@app/features/ledger/hooks/use-ledger-navigate';
import { useCurrentStacksAccountAnchoredBalances } from '@app/query/stacks/balance/balance.hooks';
import { useStacksFungibleTokenAssetBalance } from '@app/query/stacks/balance/crypto-asset-balances.hooks';
import { useCalculateStacksTxFees } from '@app/query/stacks/fees/fees.hooks';
import { useGetFungibleTokenMetadataQuery } from '@app/query/stacks/fungible-tokens/fungible-token-metadata.query';
import { useNextNonce } from '@app/query/stacks/nonce/account-nonces.hooks';
import {
  useFtTokenTransferUnsignedTx,
  useGenerateFtTokenTransferUnsignedTx,
} from '@app/store/transactions/token-transfer.hooks';

import { AmountField } from '../_components/amount-field';
import { FormErrors } from '../_components/form-errors';
import { FormFieldsLayout } from '../_components/form-fields.layout';
import { MemoField } from '../_components/memo-field';
import { PreviewButton } from '../_components/preview-button';
import { RecipientField } from '../_components/recipient-field';
import { SelectedAssetField } from '../_components/selected-asset-field';
import { useHighFeeWarning } from '../_hooks/use-high-fee-warning';
import { useSendFormNavigate } from '../_hooks/use-send-form-navigate';
import { createDefaultInitialFormValues } from '../send-form.utils';
import { useStacksFtParams } from './use-stacks-ft-params';

interface StacksSip10FungibleTokenSendFormProps {
  symbol: string;
}
export function StacksSip10FungibleTokenSendForm({
  symbol,
}: StacksSip10FungibleTokenSendFormProps) {
  const navigate = useNavigate();
  const shouldFormShowHighFeeWarning = useHighFeeWarning();
  const { data: nextNonce } = useNextNonce();
  const { contractId } = useStacksFtParams();
  const { data: ftMetadata } = useGetFungibleTokenMetadataQuery(
    pullContractIdFromIdentity(contractId)
  );
  const assetBalance = useStacksFungibleTokenAssetBalance(contractId);
  const unsignedTx = useFtTokenTransferUnsignedTx(contractId);
  const { data: stacksFtFees } = useCalculateStacksTxFees(unsignedTx);
  const { data: balances } = useCurrentStacksAccountAnchoredBalances();
  const generateTx = useGenerateFtTokenTransferUnsignedTx(contractId);
  const { whenWallet } = useWalletType();
  const ledgerNavigate = useLedgerNavigate();
  const sendFormNavigate = useSendFormNavigate();

  logger.debug('info', ftMetadata);

  const initialValues: StacksSendFormValues = createDefaultInitialFormValues({
    fee: '',
    feeCurrency: 'STX',
    feeType: FeeTypes[FeeTypes.Unknown],
    memo: '',
    nonce: nextNonce?.nonce,
    recipient: '',
    recipientAddressOrBnsName: '',
    symbol,
  });

  const validationSchema = yup.object({
    amount: stacksFungibleTokenValidator(
      assetBalance ? assetBalance.balance : createMoney(0, 'STX')
    ),
    recipient: stxAddressValidator(FormErrorMessages.InvalidAddress),
    fee: stxFeeValidator(balances?.stx.availableStx),
    memo: stxMemoValidator(FormErrorMessages.MemoExceedsLimit),
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
      software: () =>
        sendFormNavigate.toConfirmAndSignStacksSip10Transaction({
          decimals: assetBalance?.balance.decimals,
          name: assetBalance?.asset.name,
          symbol,
          tx,
        }),
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
      <Form>
        <AmountField symbol={symbol.toUpperCase()} rightInputOverlay={<></>} />
        <FormFieldsLayout>
          <SelectedAssetField
            icon={<StxAvatar />}
            name={symbol}
            onClickAssetGoBack={() => navigate(RouteUrls.SendCryptoAsset)}
            symbol={symbol}
          />
          <RecipientField />
          <MemoField />
        </FormFieldsLayout>
        <FeesRow fees={stacksFtFees} isSponsored={false} mt="base" />
        <FormErrors />
        <PreviewButton />
        <EditNonceButton
          onEditNonce={() => navigate(RouteUrls.EditNonce, { state: { contractId } })}
          my={['loose', 'base']}
        />
        <HighFeeDrawer />
        <Outlet />
      </Form>
    </Formik>
  );
}
