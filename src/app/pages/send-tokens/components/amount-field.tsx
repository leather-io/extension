import { memo } from 'react';
import { Box, Input, InputGroup, Stack, StackProps, Text } from '@stacks/ui';
import { useFormikContext } from 'formik';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import {
  useBaseAssetsUnanchored,
  useCurrentAccountUnanchoredBalances,
} from '@app/query/stacks/balance/balance.hooks';
import { SendFormValues } from '@app/common/transactions/transaction-utils';
import { ErrorLabel } from '@app/components/error-label';
import { SendFormSelectors } from '@tests/page-objects/send-form.selectors';
import { useSelectedAsset } from '@app/pages/send-tokens/hooks/use-selected-asset';

import { useSendAmountFieldActions } from '../hooks/use-send-form';
import { SendMaxButton } from './send-max-button';

interface AmountFieldProps extends StackProps {
  error?: string;
  value: number | string;
}

// TODO: this should use a new "Field" component (with inline label like in figma)
function AmountFieldBase(props: AmountFieldProps) {
  const { error, value, ...rest } = props;
  const { handleChange, values } = useFormikContext<SendFormValues>();
  const analytics = useAnalytics();
  const assets = useBaseAssetsUnanchored();
  const balances = useCurrentAccountUnanchoredBalances();
  const { selectedAsset, placeholder } = useSelectedAsset(values.assetId);
  const { handleOnKeyDown, handleSetSendMax } = useSendAmountFieldActions();

  const handleSetSendMaxTracked = () => {
    void analytics.track('select_maximum_amount_for_send');
    return handleSetSendMax(values.fee);
  };

  return (
    <Stack {...rest}>
      <InputGroup flexDirection="column">
        <Text as="label" display="block" mb="tight" fontSize={1} fontWeight="500" htmlFor="amount">
          Amount
        </Text>
        <Box position="relative">
          <Input
            display="block"
            type="text"
            inputMode="numeric"
            width="100%"
            placeholder={placeholder || 'Select an asset first'}
            min="0"
            autoFocus={assets?.length === 1}
            value={value === 0 ? '' : value}
            onKeyDown={handleOnKeyDown}
            onChange={handleChange}
            autoComplete="off"
            name="amount"
            data-testid={SendFormSelectors.InputAmountField}
          />
          {balances && selectedAsset ? (
            <SendMaxButton
              fee={values.fee}
              onClick={() => handleSetSendMaxTracked()}
              selectedAsset={selectedAsset}
            />
          ) : null}
        </Box>
      </InputGroup>
      {error && (
        <ErrorLabel data-testid={SendFormSelectors.InputAmountFieldErrorLabel}>
          <Text textStyle="caption">{error}</Text>
        </ErrorLabel>
      )}
    </Stack>
  );
}

export const AmountField = memo(AmountFieldBase);
