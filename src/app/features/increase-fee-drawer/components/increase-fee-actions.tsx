import { Button, Stack } from '@stacks/ui';
import { useFormikContext } from 'formik';

import { LoadingKeys, useLoading } from '@app/common/hooks/use-loading';
import { useWalletType } from '@app/common/use-wallet-type';

interface IncreaseFeeActionsProps {
  isDisabled: boolean;
  onCancel: () => void;
}
export function IncreaseFeeActions(props: IncreaseFeeActionsProps) {
  const { onCancel, isDisabled } = props;

  const { handleSubmit } = useFormikContext();
  const { isLoading } = useLoading(LoadingKeys.INCREASE_FEE_DRAWER);
  const { whenWallet } = useWalletType();

  const actionText = whenWallet({ ledger: 'Confirm on Ledger', software: 'Submit' });

  return (
    <Stack isInline>
      <Button onClick={onCancel} flexGrow={1} borderRadius="10px" mode="tertiary">
        Cancel
      </Button>
      <Button
        type="submit"
        flexGrow={1}
        onClick={handleSubmit}
        isLoading={isLoading}
        borderRadius="10px"
        isDisabled={isDisabled}
      >
        {actionText}
      </Button>
    </Stack>
  );
}
