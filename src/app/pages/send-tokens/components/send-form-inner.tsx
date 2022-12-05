import { Suspense, useCallback } from 'react';

import { Box, Stack, Text } from '@stacks/ui';
import { SendFormSelectors } from '@tests-legacy/page-objects/send-form.selectors';
import { useFormikContext } from 'formik';

import { HIGH_FEE_AMOUNT_STX } from '@shared/constants';
import type {
  StacksCryptoCurrencyAssetBalance,
  StacksFungibleTokenAssetBalance,
} from '@shared/models/crypto-asset-balance.model';
import { StacksFeeEstimateLegacy } from '@shared/models/fees/_fees-legacy.model';
import type { SendFormValues } from '@shared/models/form.model';
import { isEmpty, isUndefined } from '@shared/utils';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { useSelectedAssetBalance } from '@app/common/hooks/use-selected-asset-balance';
import { getFullyQualifiedStacksAssetName } from '@app/common/utils';
import { ErrorLabel } from '@app/components/error-label';
import { FeeRow } from '@app/components/fee-row/fee-row';
import { CENTERED_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';
import { LoadingRectangle } from '@app/components/loading-rectangle';
import { PrimaryButton } from '@app/components/primary-button';
import { ShowEditNonceAction } from '@app/components/show-edit-nonce';
import { AmountField } from '@app/pages/send-tokens/components/amount-field';
import { AssetSearch } from '@app/pages/send-tokens/components/asset-search/asset-search';
import { MemoField } from '@app/pages/send-tokens/components/memo-field';

import { SendFormMemoWarning } from './memo-warning';
import { RecipientField } from './recipient-field/recipient-field';

interface SendFormInnerProps {
  assetError: string | undefined;
  feeEstimations: StacksFeeEstimateLegacy[];
  onAssetIdSelected(assetId: string): void;
  nonce: number | undefined;
}
export function SendFormInner(props: SendFormInnerProps) {
  const { assetError, feeEstimations, onAssetIdSelected, nonce } = props;
  const { handleSubmit, values, setValues, errors, setFieldError, validateForm } =
    useFormikContext<SendFormValues>();

  const { isShowingHighFeeConfirmation, setIsShowingHighFeeConfirmation } = useDrawers();
  const { selectedAssetBalance } = useSelectedAssetBalance(values.assetId);
  const analytics = useAnalytics();

  const onSubmit = useCallback(async () => {
    if (selectedAssetBalance && values.amount && values.recipient && values.fee) {
      // We need to check for errors here before we show the high fee confirmation
      const formErrors = await validateForm();
      if (isEmpty(formErrors) && values.fee > HIGH_FEE_AMOUNT_STX) {
        return setIsShowingHighFeeConfirmation(!isShowingHighFeeConfirmation);
      }
      handleSubmit();
    }
  }, [
    handleSubmit,
    selectedAssetBalance,
    setIsShowingHighFeeConfirmation,
    isShowingHighFeeConfirmation,
    validateForm,
    values.amount,
    values.fee,
    values.recipient,
  ]);

  const onSelectAssetBalance = (
    assetBalance: StacksCryptoCurrencyAssetBalance | StacksFungibleTokenAssetBalance
  ) => {
    void analytics.track('select_asset_for_send');
    const assetId = getFullyQualifiedStacksAssetName(assetBalance);
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

  return (
    <Stack
      maxWidth={CENTERED_FULL_PAGE_MAX_WIDTH}
      mt="loose"
      px={['loose', 'base-loose']}
      spacing="loose"
      width="100%"
    >
      <AssetSearch onSelectAssetBalance={onSelectAssetBalance} />
      <Suspense fallback={<></>}>
        <AmountField error={errors.amount} value={values.amount || 0} />
      </Suspense>
      <RecipientField error={errors.recipient} value={values.recipientAddressOrBnsName} />
      {selectedAssetBalance?.asset.hasMemo && <MemoField value={values.memo} error={errors.memo} />}
      {selectedAssetBalance?.asset.hasMemo && selectedAssetBalance?.asset.symbol && (
        <SendFormMemoWarning symbol={selectedAssetBalance?.asset.symbol} />
      )}
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
