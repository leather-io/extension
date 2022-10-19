import { Suspense, useCallback } from 'react';
import { useFormikContext } from 'formik';
import { Box, Text, Stack } from '@stacks/ui';

import { getFullyQualifiedAssetName } from '@app/common/utils';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { HIGH_FEE_AMOUNT_STX } from '@shared/constants';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { AssetWithMeta } from '@app/common/asset-types';
import { isEmpty, isUndefined } from '@shared/utils';
import { SendFormValues } from '@app/common/transactions/transaction-utils';
import { ErrorLabel } from '@app/components/error-label';
import { ShowEditNonceAction } from '@app/components/show-edit-nonce';
import { FeeRow } from '@app/components/fee-row/fee-row';
import { CENTERED_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';
import { PrimaryButton } from '@app/components/primary-button';
import { AssetSearch } from '@app/pages/send-tokens/components/asset-search/asset-search';
import { AmountField } from '@app/pages/send-tokens/components/amount-field';
import { useSelectedAsset } from '@app/pages/send-tokens/hooks/use-selected-asset';
import { RecipientField } from '@app/pages/send-tokens/components/recipient-field';
import { MemoField } from '@app/pages/send-tokens/components/memo-field';
import { LoadingRectangle } from '@app/components/loading-rectangle';
import { FeeEstimate } from '@shared/models/fees-types';
import { SendFormSelectors } from '@tests/page-objects/send-form.selectors';

import { SendFormMemoWarning } from './memo-warning';

interface SendFormInnerProps {
  assetError: string | undefined;
  feeEstimations: FeeEstimate[];
  onAssetIdSelected(assetId: string): void;
  nonce: number | undefined;
}
export function SendFormInner(props: SendFormInnerProps) {
  const { assetError, feeEstimations, onAssetIdSelected, nonce } = props;
  const { handleSubmit, values, setValues, errors, setFieldError, validateForm } =
    useFormikContext<SendFormValues>();

  const { showHighFeeConfirmation, setShowHighFeeConfirmation } = useDrawers();
  const { selectedAsset } = useSelectedAsset(values.assetId);
  const analytics = useAnalytics();

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

  const onSelectAsset = (asset: AssetWithMeta) => {
    void analytics.track('select_asset_for_send');
    const assetId = getFullyQualifiedAssetName(asset) || '';
    onAssetIdSelected(assetId);
    setValues({
      ...values,
      amount: '',
      assetId,
      fee: '',
      nonce,
    });
    setFieldError('amount', undefined);
  };

  const hasValues =
    values.amount && values.recipient !== '' && values.fee && !isUndefined(values.nonce);

  const symbol = selectedAsset?.type === 'stx' ? 'STX' : selectedAsset?.meta?.symbol;

  return (
    <Stack
      maxWidth={CENTERED_FULL_PAGE_MAX_WIDTH}
      mt="loose"
      px={['loose', 'base-loose']}
      spacing="loose"
      width="100%"
    >
      <AssetSearch onSelectAsset={onSelectAsset} />
      <Suspense fallback={<></>}>
        <AmountField error={errors.amount} value={values.amount || 0} />
      </Suspense>
      <RecipientField error={errors.recipient} value={values.recipient} />
      {selectedAsset?.hasMemo && <MemoField value={values.memo} error={errors.memo} />}
      {selectedAsset?.hasMemo && symbol && <SendFormMemoWarning symbol={symbol} />}
      {feeEstimations.length ? (
        <FeeRow
          feeEstimations={feeEstimations}
          feeFieldName="fee"
          feeTypeFieldName="feeType"
          isSponsored={false}
        />
      ) : (
        <LoadingRectangle height="32px" width="100%" />
      )}
      <Box mt="auto">
        {assetError && (
          <ErrorLabel mb="base">
            <Text textStyle="caption">{assetError}</Text>
          </ErrorLabel>
        )}
        <PrimaryButton
          data-testid={SendFormSelectors.BtnPreviewSendTx}
          isDisabled={!hasValues}
          onClick={onSubmit}
          width="100%"
        >
          Preview
        </PrimaryButton>
      </Box>
      <Box mb={['loose', 'unset']}>
        <ShowEditNonceAction />
      </Box>
    </Stack>
  );
}
