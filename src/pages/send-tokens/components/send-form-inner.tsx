import React, { Suspense, useCallback, useEffect } from 'react';
import { useFormikContext } from 'formik';
import { Box, Text, Button, Stack } from '@stacks/ui';

import { useNextTxNonce } from '@common/hooks/account/use-next-tx-nonce';
import { microStxToStx } from '@common/stacks-utils';
import { TransactionFormValues } from '@common/types';
import { ErrorLabel } from '@components/error-label';
import { FeeRow } from '@features/fee-row/fee-row';
import { AssetSearch } from '@pages/send-tokens/components/asset-search/asset-search';
import { useSelectedAsset } from '@common/hooks/use-selected-asset';
import { AmountField } from '@pages/send-tokens/components/amount-field';
import { useTransferableAssets } from '@store/assets/asset.hooks';
import { RecipientField } from '@pages/send-tokens/components/recipient-field';
import { MemoField } from '@pages/send-tokens/components/memo-field';
import {
  useFeeEstimationsState,
  useFeeRateState,
  useFeeState,
} from '@store/transactions/fees.hooks';
import { SendFormSelectors } from '@tests/page-objects/send-form.selectors';
import { LoadingKeys, useLoading } from '@common/hooks/use-loading';
import { useLocalStxTransactionAmount } from '@store/transactions/local-transactions.hooks';
import {
  useEstimatedTransactionByteLengthState,
  useSerializedTransactionPayloadState,
} from '@store/transactions/transaction.hooks';
import { useFeeEstimationsQuery } from '@query/fees/fees.hooks';
import { ShowEditNonceAction } from '@components/show-edit-nonce';
import { Estimations } from '@models/fees-types';

import { SendFormMemoWarning } from './memo-warning';

interface SendFormProps {
  assetError: string | undefined;
}

export function SendFormInner(props: SendFormProps) {
  const { assetError } = props;
  useNextTxNonce();
  const { isLoading } = useLoading(LoadingKeys.SEND_TOKENS_FORM);
  const serializedTxPayload = useSerializedTransactionPayloadState();
  const estimatedTxByteLength = useEstimatedTransactionByteLengthState();
  const { data: feeEstimationsResp, isError } = useFeeEstimationsQuery(
    serializedTxPayload,
    estimatedTxByteLength
  );
  const [, setFeeEstimations] = useFeeEstimationsState();
  const [fee, setFee] = useFeeState();
  const [, setFeeRate] = useFeeRateState();
  const [amount, setAmount] = useLocalStxTransactionAmount();
  const { selectedAsset } = useSelectedAsset();
  const assets = useTransferableAssets();

  const { handleSubmit, values, setValues, errors, setFieldError, setFieldValue } =
    useFormikContext<TransactionFormValues>();

  useEffect(() => {
    if (!fee && feeEstimationsResp && feeEstimationsResp.estimations) {
      setFeeEstimations(feeEstimationsResp.estimations);
      setFee(feeEstimationsResp.estimations[Estimations.Middle].fee);
      setFeeRate(feeEstimationsResp.estimations[Estimations.Middle].fee_rate);
      setFieldValue('txFee', microStxToStx(feeEstimationsResp.estimations[Estimations.Middle].fee));
    }
  }, [fee, feeEstimationsResp, setFee, setFeeEstimations, setFeeRate, setFieldValue]);

  useEffect(() => {
    return () => {
      if (amount) setAmount(null);
    };
  }, [amount, setAmount]);

  const onSubmit = useCallback(async () => {
    if (values.amount && values.recipient && values.txFee && selectedAsset) {
      selectedAsset.type === 'stx' && setAmount(values.amount);
      handleSubmit();
    }
  }, [values.amount, values.recipient, values.txFee, selectedAsset, setAmount, handleSubmit]);

  const onItemSelect = useCallback(() => {
    if (assets.length === 1) return;
    setValues({ ...values, amount: '', txFee: '' });
    setFieldError('amount', undefined);
    setFeeEstimations([]);
    setFee(null);
    setFeeRate(null);
    if (amount) setAmount(null);
  }, [
    assets.length,
    setValues,
    values,
    setFieldError,
    setFeeEstimations,
    setFee,
    setFeeRate,
    amount,
    setAmount,
  ]);

  const hasValues = values.amount && values.recipient !== '' && (values.txFee || fee);

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
        <FeeRow feeEstimationsQueryError={isError || feeEstimationsResp?.error} />
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
