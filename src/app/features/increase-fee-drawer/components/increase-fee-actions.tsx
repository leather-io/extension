import { useFormikContext } from 'formik';
import { Flex } from 'leather-styles/jsx';

import { LoadingKeys, useLoading } from '@app/common/hooks/use-loading';
import { useWalletType } from '@app/common/use-wallet-type';
import { Button } from '@app/ui/components/button/button';

interface IncreaseFeeActionsProps {
  isDisabled: boolean;
  onCancel(): void;
}
export function IncreaseFeeActions(props: IncreaseFeeActionsProps) {
  const { onCancel, isDisabled } = props;

  const { handleSubmit } = useFormikContext();
  const { isLoading } = useLoading(LoadingKeys.INCREASE_FEE_DRAWER);
  const { whenWallet } = useWalletType();

  const actionText = whenWallet({ ledger: 'Confirm on Ledger', software: 'Submit' });

  return (
    <Flex gap="space.02">
      <Button onClick={onCancel} variant="outline" flex="1">
        Cancel
      </Button>
      <Button
        type="submit"
        flex="1"
        onClick={handleSubmit as any}
        aria-busy={isLoading}
        borderRadius="sm"
        aria-disabled={isDisabled}
      >
        {actionText}
      </Button>
    </Flex>
  );
}
