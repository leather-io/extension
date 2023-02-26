import { useMemo, useState } from 'react';
import { Navigate, Outlet, useNavigate, useParams } from 'react-router-dom';

import { Form, Formik, FormikHelpers } from 'formik';
import * as yup from 'yup';

import { HIGH_FEE_AMOUNT_STX, HIGH_FEE_WARNING_LEARN_MORE_URL_STX } from '@shared/constants';
import { logger } from '@shared/logger';
import { FeeTypes } from '@shared/models/fees/_fees.model';
import { StacksSendFormValues } from '@shared/models/form.model';
import { createMoney } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';
import { isEmpty, isString } from '@shared/utils';

import { FormErrorMessages } from '@app/common/error-messages';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { useOnMount } from '@app/common/hooks/use-on-mount';
import { convertAmountToBaseUnit } from '@app/common/money/calculate-money';
import { useWalletType } from '@app/common/use-wallet-type';
import { stacksFungibleTokenAmountValidator } from '@app/common/validation/forms/amount-validators';
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
import { useUpdatePersistedSendFormValues } from '@app/features/popup-send-form-restoration/use-update-persisted-send-form-values';
import { useCurrentStacksAccountAnchoredBalances } from '@app/query/stacks/balance/balance.hooks';
import { useStacksFungibleTokenAssetBalance } from '@app/query/stacks/balance/crypto-asset-balances.hooks';
import { useCalculateStacksTxFees } from '@app/query/stacks/fees/fees.hooks';
import { useNextNonce } from '@app/query/stacks/nonce/account-nonces.hooks';
import { useCurrentAccountStxAddressState } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useStacksClientUnanchored } from '@app/store/common/api-clients.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';
import {
  useFtTokenTransferUnsignedTx,
  useGenerateFtTokenTransferUnsignedTx,
} from '@app/store/transactions/token-transfer.hooks';

import { AmountField } from '../../components/amount-field';
import { FormErrors } from '../../components/form-errors';
import { FormFieldsLayout } from '../../components/form-fields.layout';
import { MemoField } from '../../components/memo-field';
import { PreviewButton } from '../../components/preview-button';
import { SelectedAssetField } from '../../components/selected-asset-field';
import { SendCryptoAssetFormLayout } from '../../components/send-crypto-asset-form.layout';
import { SendMaxButton } from '../../components/send-max-button';
import { StacksRecipientField } from '../../family/stacks/components/stacks-recipient-field';
import { useSendFormNavigate } from '../../hooks/use-send-form-navigate';
import { useSendFormRouteState } from '../../hooks/use-send-form-route-state';
import { createDefaultInitialFormValues, defaultSendFormFormikProps } from '../../send-form.utils';
import { useStacksFtRouteState } from './use-stacks-ft-params';

export function StacksSip10FungibleTokenSendForm({}) {
  const [contractId, setContractId] = useState('');
  const { symbol } = useParams();
  const navigate = useNavigate();
  const { isShowingHighFeeConfirmation, setIsShowingHighFeeConfirmation } = useDrawers();
  const { data: nextNonce } = useNextNonce();
  const { contractId: routeContractId } = useStacksFtRouteState();
  const routeState = useSendFormRouteState();
  const assetBalance = useStacksFungibleTokenAssetBalance(contractId);
  const unsignedTx = useFtTokenTransferUnsignedTx(contractId);
  const { data: stacksFtFees } = useCalculateStacksTxFees(unsignedTx);
  const { data: balances } = useCurrentStacksAccountAnchoredBalances();
  const generateTx = useGenerateFtTokenTransferUnsignedTx(contractId);
  const currentAccountStxAddress = useCurrentAccountStxAddressState();
  const currentNetwork = useCurrentNetwork();
  const { whenWallet } = useWalletType();
  const client = useStacksClientUnanchored();
  const ledgerNavigate = useLedgerNavigate();
  const sendFormNavigate = useSendFormNavigate();
  const { onFormStateChange } = useUpdatePersistedSendFormValues();

  const availableTokenBalance = assetBalance?.balance ?? createMoney(0, 'STX');
  const sendMaxBalance = useMemo(
    () => convertAmountToBaseUnit(availableTokenBalance),
    [availableTokenBalance]
  );

  useOnMount(() => {
    setContractId(routeContractId);
  });

  const initialValues: StacksSendFormValues = createDefaultInitialFormValues({
    fee: '',
    feeCurrency: 'STX',
    feeType: FeeTypes[FeeTypes.Unknown],
    memo: '',
    nonce: nextNonce?.nonce,
    recipientAddressOrBnsName: '',
    symbol,
    ...routeState,
  });

  const validationSchema = yup.object({
    amount: stacksFungibleTokenAmountValidator(availableTokenBalance),
    recipient: stxRecipientValidator(currentAccountStxAddress, currentNetwork),
    recipientAddressOrBnsName: stxRecipientAddressOrBnsNameValidator({
      client,
      currentAddress: currentAccountStxAddress,
      currentNetwork,
    }),
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
    if (!isShowingHighFeeConfirmation && isEmpty(formErrors) && values.fee > HIGH_FEE_AMOUNT_STX) {
      return setIsShowingHighFeeConfirmation(true);
    }

    const tx = await generateTx(values);
    if (!tx) return logger.error('Attempted to generate unsigned tx, but tx is undefined');

    whenWallet({
      software: () =>
        sendFormNavigate.toConfirmAndSignStacksSip10Transaction({
          decimals: assetBalance?.balance.decimals,
          name: assetBalance?.asset.name,
          tx,
        }),
      ledger: () => ledgerNavigate.toConnectAndSignTransactionStep(tx),
    })();
  }

  if (!isString(symbol)) {
    return <Navigate to={RouteUrls.SendCryptoAsset} />;
  }

  return (
    <SendCryptoAssetFormLayout>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, formikHelpers) => await previewTransaction(values, formikHelpers)}
        validationSchema={validationSchema}
        {...defaultSendFormFormikProps}
      >
        {props => {
          onFormStateChange(props.values);
          return (
            <NonceSetter>
              <Form style={{ width: '100%' }}>
                <AmountField
                  balance={availableTokenBalance}
                  bottomInputOverlay={
                    <SendMaxButton
                      balance={availableTokenBalance}
                      sendMaxBalance={sendMaxBalance.toString()}
                    />
                  }
                />
                <FormFieldsLayout>
                  <SelectedAssetField icon={<StxAvatar />} name={symbol} symbol={symbol} />
                  <StacksRecipientField />
                  <MemoField lastChild />
                </FormFieldsLayout>
                <FeesRow fees={stacksFtFees} isSponsored={false} mt="base" />
                <FormErrors />
                <PreviewButton />
                <EditNonceButton
                  onEditNonce={() => navigate(RouteUrls.EditNonce)}
                  my={['loose', 'base']}
                />
                <HighFeeDrawer learnMoreUrl={HIGH_FEE_WARNING_LEARN_MORE_URL_STX} />
                <Outlet />
              </Form>
            </NonceSetter>
          );
        }}
      </Formik>
    </SendCryptoAssetFormLayout>
  );
}
