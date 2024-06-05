import { useFormikContext } from 'formik';

import { Button } from '@leather.io/ui';

import { useWalletType } from '@app/common/use-wallet-type';

interface TransactionActionsProps {
  isBroadcasting?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  onCancel(): void;
}
export function TransactionActions(props: TransactionActionsProps) {
  const { onCancel, isDisabled, isLoading, isBroadcasting } = props;

  const { handleSubmit } = useFormikContext();

  const { whenWallet } = useWalletType();

  const actionText = whenWallet({ ledger: 'Confirm on Ledger', software: 'Submit' });

  return (
    <>
      <Button onClick={onCancel} variant="outline" flexGrow={1}>
        Cancel
      </Button>
      <Button
        type="submit"
        onClick={handleSubmit as any}
        aria-busy={isLoading || isBroadcasting}
        borderRadius="sm"
        aria-disabled={isDisabled}
        disabled={isDisabled}
        flexGrow={1}
      >
        {actionText}
      </Button>
    </>
  );
}
