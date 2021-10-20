import React from 'react';
import { useField, useFormikContext } from 'formik';
import { Button, Stack } from '@stacks/ui';

import { stxToMicroStx } from '@common/stacks-utils';
import { LoadingKeys, useLoading } from '@common/hooks/use-loading';
import { useRawDeserializedTxState, useRawTxIdState } from '@store/transactions/raw.hooks';

export function IncreaseFeeActions() {
  const [field] = useField('txFee');
  const { handleSubmit } = useFormikContext();
  const { isLoading } = useLoading(LoadingKeys.INCREASE_FEE_DRAWER);
  const [, setRawTxId] = useRawTxIdState();
  const rawTx = useRawDeserializedTxState();

  const oldFee = rawTx?.auth.spendingCondition?.fee.toNumber() || 0;
  const newFee = field.value;
  const isSame = oldFee === stxToMicroStx(newFee).toNumber();

  return (
    <Stack isInline>
      <Button onClick={() => setRawTxId(null)} flexGrow={1} borderRadius="10px" mode="tertiary">
        Cancel
      </Button>
      <Button
        type="submit"
        flexGrow={1}
        onClick={handleSubmit}
        isLoading={isLoading}
        borderRadius="10px"
        isDisabled={isSame}
      >
        Submit
      </Button>
    </Stack>
  );
}
