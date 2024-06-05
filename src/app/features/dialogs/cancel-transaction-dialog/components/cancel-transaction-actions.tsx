import { useFormikContext } from 'formik';

import { LoadingKeys, useLoading } from '@app/common/hooks/use-loading';
import { useWalletType } from '@app/common/use-wallet-type';
import { Button } from '@app/ui/components/button/button';

interface CancelTransactionActionsProps {
  isDisabled?: boolean;
  isBroadcasting?: boolean;
  onCancel(): void;
}
export function CancelTransactionActions(props: CancelTransactionActionsProps) {
  const { onCancel, isDisabled, isBroadcasting } = props;

  const { handleSubmit } = useFormikContext();
  const { isLoading } = useLoading(LoadingKeys.CANCEL_TRANSACTION_DRAWER);
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
