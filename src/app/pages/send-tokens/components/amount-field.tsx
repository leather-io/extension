import { memo } from 'react';

import { Box, Input, InputGroup, Stack, StackProps, Text } from '@stacks/ui';
import { SendFormSelectors } from '@tests-legacy/page-objects/send-form.selectors';
import { useFormikContext } from 'formik';

import { SendFormValues } from '@shared/models/form.model';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useSelectedAssetBalance } from '@app/common/hooks/use-selected-asset-balance';
import { ErrorLabel } from '@app/components/error-label';
import { useStacksFungibleTokenAssetBalancesUnanchored } from '@app/query/stacks/balance/crypto-asset-balances.hooks';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';

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
  const account = useCurrentAccount();
  const { data: ftAssetBalances = [] } = useStacksFungibleTokenAssetBalancesUnanchored(
    account?.address ?? ''
  );
  const { isStx, selectedAssetBalance, placeholder } = useSelectedAssetBalance(values.assetId);
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
            autoFocus={ftAssetBalances.length === 0}
            value={value === 0 ? '' : value}
            onKeyDown={handleOnKeyDown}
            onChange={handleChange}
            autoComplete="off"
            name="amount"
            data-testid={SendFormSelectors.InputAmountField}
          />
          {selectedAssetBalance && selectedAssetBalance.asset ? (
            <SendMaxButton
              fee={values.fee}
              isStx={isStx}
              onClick={() => handleSetSendMaxTracked()}
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
