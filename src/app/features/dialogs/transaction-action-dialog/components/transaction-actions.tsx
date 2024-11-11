import { ActivitySelectors } from '@tests/selectors/activity.selectors';

import { Button } from '@leather.io/ui';

import { useWalletType } from '@app/common/use-wallet-type';

interface TransactionActionsProps {
  isBroadcasting?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  onCancel(): void;
  onSubmit?(): void;
}
export function TransactionActions(props: TransactionActionsProps) {
  const { isBroadcasting, isDisabled, isLoading, onSubmit } = props;

  const { whenWallet } = useWalletType();

  const actionText = whenWallet({ ledger: 'Confirm on Ledger', software: 'Submit' });

  return (
    <Button
      data-testid={ActivitySelectors.TransactionSubmitAction}
      type="submit"
      onClick={onSubmit}
      aria-busy={isLoading || isBroadcasting}
      borderRadius="sm"
      aria-disabled={isDisabled}
      disabled={isDisabled}
      flexGrow={1}
    >
      {actionText}
    </Button>
  );
}
