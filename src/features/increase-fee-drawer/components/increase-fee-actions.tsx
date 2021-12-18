import { useField, useFormikContext } from 'formik';
import { Button, Stack } from '@stacks/ui';

import { stxToMicroStx } from '@common/stacks-utils';
import { LoadingKeys, useLoading } from '@common/hooks/use-loading';
import { useRawTxIdState } from '@store/transactions/raw.hooks';

interface IncreaseFeeActionsProps {
  currentFee: number;
}
export function IncreaseFeeActions(props: IncreaseFeeActionsProps) {
  const { currentFee } = props;
  const [field] = useField('fee');
  const { handleSubmit } = useFormikContext();
  const { isLoading } = useLoading(LoadingKeys.INCREASE_FEE_DRAWER);
  const [, setRawTxId] = useRawTxIdState();

  const newFee = field.value;
  const isSame = currentFee === stxToMicroStx(newFee).toNumber();

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
