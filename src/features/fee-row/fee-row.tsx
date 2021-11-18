import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { FiInfo } from 'react-icons/fi';
import { useFormikContext } from 'formik';
import { Box, color, Stack, Text } from '@stacks/ui';

import { SendFormErrorMessages } from '@common/error-messages';
import { stacksValue } from '@common/stacks-utils';
import { TransactionFormValues } from '@common/types';
import { openInNewTab } from '@common/utils/open-in-new-tab';
import { ErrorLabel } from '@components/error-label';
import { Tooltip } from '@components/tooltip';
import { WarningLabel } from '@components/warning-label';
import { LoadingRectangle } from '@components/loading-rectangle';
import { SpaceBetween } from '@components/space-between';
import { Caption } from '@components/typography';
import { Estimations } from '@models/fees-types';
import {
  useFeeEstimationsState,
  useFeeRateState,
  useFeeState,
} from '@store/transactions/fees.hooks';
import { SendFormSelectors } from '@tests/page-objects/send-form.selectors';

import { TransactionFee } from './components/transaction-fee';
import { FeeEstimateItem } from './components/fee-estimate-item';
import { FeeEstimateSelect } from './components/fee-estimate-select';
import { CustomFeeField } from './components/custom-fee-field';

const FEES_INFO =
  'Higher fees increase the likelihood of your transaction getting confirmed before others. Click to learn more.';
const URL = 'https://hiro.so/questions/fee-estimates';

interface FeeRowProps {
  feeEstimationsQueryError: boolean | string | undefined;
}

export function FeeRow(props: FeeRowProps): JSX.Element {
  const { feeEstimationsQueryError } = props;
  const [fieldWarning, setFieldWarning] = useState<string | undefined>(undefined);
  const { errors, setFieldValue } = useFormikContext<TransactionFormValues>();
  const [isOpen, setIsOpen] = useState(false);
  const [feeEstimations] = useFeeEstimationsState();
  const [fee, setFee] = useFeeState();
  const [, setFeeRate] = useFeeRateState();
  const [selected, setSelected] = useState(Estimations.Middle);
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    // Check for query error on mount and fallback
    // to the custom input if needed
    if (feeEstimationsQueryError) {
      setSelected(Estimations.Custom);
      setIsCustom(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handles using the fee estimations selector or custom input
  const handleSelectedItem = useCallback(
    (index: number) => {
      if (!feeEstimations) return;
      if (selected !== index) setSelected(index);
      if (index === Estimations.Custom) {
        // Set the value to the last selected estimation fee
        if (fee)
          setFieldValue(
            'txFee',
            stacksValue({
              value: fee,
              withTicker: false,
            })
          );
        setIsCustom(true);
      } else {
        // Use selector estimation values
        setFee(feeEstimations[index].fee);
        setFeeRate(feeEstimations[index].fee_rate);
        // Keep custom input in sync
        setFieldValue(
          'txFee',
          stacksValue({
            value: feeEstimations[index].fee,
            withTicker: false,
          }),
          true
        );
        setFieldWarning(undefined);
        setIsCustom(false);
      }
      setIsOpen(false);
    },
    [fee, feeEstimations, selected, setFee, setFeeRate, setFieldValue]
  );

  const fieldError = useMemo(() => {
    switch (errors.txFee) {
      case SendFormErrorMessages.AdjustedFeeExceedsBalance:
        return 'The fee added now exceeds your current STX balance.';
      default:
        return errors.txFee;
    }
  }, [errors.txFee]);

  return (
    <>
      <Stack spacing="base">
        <SpaceBetween position="relative">
          <Stack alignItems="center" isInline>
            <Caption>Fees</Caption>
            <Stack _hover={{ cursor: 'pointer' }}>
              <FeeEstimateItem
                hasFeeEstimations={!feeEstimationsQueryError}
                index={selected}
                onClick={!feeEstimationsQueryError ? () => setIsOpen(true) : undefined}
              />
              <FeeEstimateSelect
                items={feeEstimations}
                onClick={handleSelectedItem}
                setIsOpen={setIsOpen}
                visible={isOpen}
              />
            </Stack>
            <Tooltip label={FEES_INFO} placement="bottom">
              <Stack>
                <Box
                  _hover={{ cursor: 'pointer' }}
                  as={FiInfo}
                  color={color('text-caption')}
                  onClick={() => openInNewTab(URL)}
                  size="14px"
                />
              </Stack>
            </Tooltip>
          </Stack>
          {isCustom ? (
            <CustomFeeField setFieldWarning={setFieldWarning} />
          ) : !fee ? (
            <LoadingRectangle width="50px" height="10px" />
          ) : (
            <Suspense
              fallback={
                <>
                  {stacksValue({
                    value: 0,
                    fixedDecimals: true,
                  })}
                </>
              }
            >
              <Caption>
                <TransactionFee />
              </Caption>
            </Suspense>
          )}
        </SpaceBetween>
        {errors.txFee && (
          <ErrorLabel data-testid={SendFormSelectors.InputCustomFeeFieldErrorLabel}>
            <Text lineHeight="18px" textStyle="caption">
              {fieldError}
            </Text>
          </ErrorLabel>
        )}
        {!errors.txFee && fieldWarning && <WarningLabel>{fieldWarning}</WarningLabel>}
      </Stack>
    </>
  );
}
