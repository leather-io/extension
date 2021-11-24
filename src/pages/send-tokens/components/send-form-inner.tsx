import React, { Suspense, useCallback, useEffect } from 'react';
import { useFormikContext } from 'formik';
import { Box, Text, Button, Stack } from '@stacks/ui';

import { HIGH_FEE_AMOUNT_STX } from '@common/constants';
import { useDrawers } from '@common/hooks/use-drawers';
import { LoadingKeys, useLoading } from '@common/hooks/use-loading';
import { useNextTxNonce } from '@common/hooks/account/use-next-tx-nonce';
import { useSelectedAsset } from '@common/hooks/use-selected-asset';
import { isEmpty } from '@common/utils';
import { stacksValue } from '@common/stacks-utils';
import { isTxSponsored, TransactionFormValues } from '@common/transactions/transaction-utils';
import { ErrorLabel } from '@components/error-label';
import { ShowEditNonceAction } from '@components/show-edit-nonce';
import { FeeRow } from '@components/fee-row/fee-row';
import { Estimations } from '@models/fees-types';
import { AssetSearch } from '@pages/send-tokens/components/asset-search/asset-search';
import { AmountField } from '@pages/send-tokens/components/amount-field';
import { useTransferableAssets } from '@store/assets/asset.hooks';
import { RecipientField } from '@pages/send-tokens/components/recipient-field';
import { MemoField } from '@pages/send-tokens/components/memo-field';
import { useFeeEstimationsQuery } from '@query/fees/fees.hooks';
import { useFeeEstimationsState } from '@store/transactions/fees.hooks';
import { SendFormSelectors } from '@tests/page-objects/send-form.selectors';
import {
  useEstimatedTransactionByteLengthState,
  useSerializedTransactionPayloadState,
  useTxForSettingsState,
} from '@store/transactions/transaction.hooks';

import { SendFormMemoWarning } from './memo-warning';

interface SendFormProps {
  assetError: string | undefined;
}

export function SendFormInner(props: SendFormProps) {
  const { assetError } = props;
  const { handleSubmit, values, setValues, errors, setFieldError, setFieldValue, validateForm } =
    useFormikContext<TransactionFormValues>();
  const { isLoading } = useLoading(LoadingKeys.SEND_TOKENS_FORM);
  const { showHighFeeConfirmation, setShowHighFeeConfirmation } = useDrawers();
  const serializedTxPayload = useSerializedTransactionPayloadState();
  const estimatedTxByteLength = useEstimatedTransactionByteLengthState();
  const { data: feeEstimationsResp, isError } = useFeeEstimationsQuery(
    serializedTxPayload,
    estimatedTxByteLength
  );
  const [, setFeeEstimations] = useFeeEstimationsState();
  const { selectedAsset } = useSelectedAsset();
  const assets = useTransferableAssets();
  const [transaction] = useTxForSettingsState();
  const isSponsored = transaction ? isTxSponsored(transaction) : false;

  useNextTxNonce();

  useEffect(() => {
    if (!values.fee && feeEstimationsResp && feeEstimationsResp.estimations) {
      setFeeEstimations(feeEstimationsResp.estimations);
      setFieldValue(
        'fee',
        stacksValue({
          fixedDecimals: true,
          value: feeEstimationsResp.estimations[Estimations.Middle].fee,
          withTicker: false,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feeEstimationsResp, setFeeEstimations, setFieldValue]);

  const onSubmit = useCallback(async () => {
    if (selectedAsset && values.amount && values.recipient && values.fee) {
      // We need to check for errors here before we show the high fee confirmation
      const formErrors = await validateForm();
      if (isEmpty(formErrors) && values.fee > HIGH_FEE_AMOUNT_STX) {
        return setShowHighFeeConfirmation(!showHighFeeConfirmation);
      }
      handleSubmit();
    }
  }, [
    handleSubmit,
    selectedAsset,
    setShowHighFeeConfirmation,
    showHighFeeConfirmation,
    validateForm,
    values.amount,
    values.fee,
    values.recipient,
  ]);

  const onItemSelect = useCallback(() => {
    if (assets.length === 1) return;
    setValues({ ...values, amount: '', fee: '' });
    setFieldError('amount', undefined);
  }, [assets.length, setValues, values, setFieldError]);

  const hasValues = values.amount && values.recipient !== '' && values.fee;

  const symbol = selectedAsset?.type === 'stx' ? 'STX' : selectedAsset?.meta?.symbol;

  return (
    <Stack spacing="loose" flexDirection="column" flexGrow={1} shouldWrapChildren>
      <AssetSearch onItemClick={onItemSelect} />
      <Suspense fallback={<></>}>
        <AmountField
          error={errors.amount}
          feeQueryError={!!feeEstimationsResp?.error}
          value={values.amount || 0}
        />
      </Suspense>
      <RecipientField error={errors.recipient} value={values.recipient} />
      {selectedAsset?.hasMemo && <MemoField value={values.memo} error={errors.memo} />}
      {selectedAsset?.hasMemo && symbol && <SendFormMemoWarning symbol={symbol} />}
      {feeEstimationsResp && (
        <FeeRow
          fieldName="fee"
          isSponsored={isSponsored}
          feeEstimationsError={isError || !!feeEstimationsResp?.error}
        />
      )}
      <Box mt="auto">
        {assetError && (
          <ErrorLabel mb="base">
            <Text textStyle="caption">{assetError}</Text>
          </ErrorLabel>
        )}
        <Button
          type="submit"
          borderRadius="12px"
          width="100%"
          isDisabled={!hasValues}
          onClick={onSubmit}
          data-testid={SendFormSelectors.BtnPreviewSendTx}
          isLoading={isLoading}
        >
          Preview
        </Button>
      </Box>
      <ShowEditNonceAction />
    </Stack>
  );
}
