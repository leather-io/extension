import { Suspense, useCallback, useEffect, useState } from 'react';
import { FiInfo } from 'react-icons/fi';
import { useField } from 'formik';
import { Box, color, Stack, Text } from '@stacks/ui';

import { microStxToStx, stacksValue } from '@app/common/stacks-utils';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { ErrorLabel } from '@app/components/error-label';
import { Tooltip } from '@app/components/tooltip';
import { WarningLabel } from '@app/components/warning-label';
import { LoadingRectangle } from '@app/components/loading-rectangle';
import { SpaceBetween } from '@app/components/space-between';
import { SponsoredLabel } from '@app/components/sponsored-label';
import { Caption } from '@app/components/typography';
import { Estimations } from '@shared/models/fees-types';
import { useFeeEstimationsState } from '@app/store/transactions/fees.hooks';
import { SendFormSelectors } from '@tests/page-objects/send-form.selectors';

import { TransactionFee } from './components/transaction-fee';
import { FeeEstimateItem } from './components/fee-estimate-item';
import { FeeEstimateSelect } from './components/fee-estimate-select';
import { CustomFeeField } from './components/custom-fee-field';

const feesInfo =
  'Higher fees increase the likelihood of your transaction getting confirmed before others. Click to learn more.';
const url = 'https://hiro.so/questions/fee-estimates';

interface FeeRowProps {
  feeFieldName: string;
  feeTypeFieldName: string;
  isSponsored: boolean;
}
export function FeeRow(props: FeeRowProps): JSX.Element {
  const { feeFieldName, isSponsored, feeTypeFieldName } = props;

  const [feeInput, feeMeta, feeHelper] = useField(feeFieldName);
  const [, , feeTypeHelper] = useField(feeTypeFieldName);
  const [fieldWarning, setFieldWarning] = useState<string | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [feeEstimations] = useFeeEstimationsState();
  const [selected, setSelected] = useState(Estimations.Middle);
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    // Set it to the middle estimation on mount
    if (!feeInput.value && !isCustom && feeEstimations.length) {
      feeHelper.setValue(microStxToStx(feeEstimations[1].fee).toNumber());
      feeTypeHelper.setValue(Estimations[Estimations.Middle]);
    }
    if (isSponsored) {
      feeHelper.setValue(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feeEstimations, feeHelper, isCustom]);

  // Handles using the fee estimations selector or custom input
  const handleSelectedItem = useCallback(
    (index: number) => {
      if (!feeEstimations) return;
      if (selected !== index) setSelected(index);
      feeTypeHelper.setValue(Estimations[index]);
      if (index === Estimations.Custom) {
        feeHelper.setValue('');
        setIsCustom(true);
      } else {
        feeHelper.setValue(
          stacksValue({
            fixedDecimals: true,
            value: feeEstimations[index].fee,
            withTicker: false,
          })
        );
        setFieldWarning('');
        setIsCustom(false);
      }
      setIsOpen(false);
    },
    [feeEstimations, feeTypeHelper, feeHelper, selected]
  );

  return (
    <Stack spacing="base">
      <SpaceBetween position="relative">
        <Stack alignItems="center" isInline>
          <Caption>Fees</Caption>
          {!isSponsored ? (
            <>
              <Stack _hover={{ cursor: 'pointer' }}>
                <FeeEstimateItem index={selected} onClick={() => setIsOpen(true)} />
                <FeeEstimateSelect
                  items={feeEstimations}
                  onClick={handleSelectedItem}
                  selected={selected}
                  setIsOpen={setIsOpen}
                  visible={isOpen}
                />
              </Stack>
              <Tooltip label={feesInfo} placement="bottom">
                <Stack>
                  <Box
                    _hover={{ cursor: 'pointer' }}
                    as={FiInfo}
                    color={color('text-caption')}
                    onClick={() => openInNewTab(url)}
                    size="14px"
                  />
                </Stack>
              </Tooltip>
            </>
          ) : null}
        </Stack>
        {isCustom ? (
          <CustomFeeField fieldName={feeFieldName} setFieldWarning={setFieldWarning} />
        ) : !isSponsored && !feeInput.value ? (
          <LoadingRectangle width="50px" height="10px" />
        ) : (
          <Suspense fallback={<></>}>
            <Caption>
              <TransactionFee fee={feeInput.value} />
            </Caption>
          </Suspense>
        )}
      </SpaceBetween>
      {feeMeta.error && (
        <ErrorLabel data-testid={SendFormSelectors.InputCustomFeeFieldErrorLabel}>
          <Text
            lineHeight="18px"
            textStyle="caption"
            data-testid={SendFormSelectors.InputCustomFeeFieldError}
          >
            {feeMeta.error}
          </Text>
        </ErrorLabel>
      )}
      {isSponsored && <SponsoredLabel />}
      {!feeMeta.error && fieldWarning && <WarningLabel>{fieldWarning}</WarningLabel>}
    </Stack>
  );
}
