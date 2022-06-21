import { useNavigate } from 'react-router-dom';
import { useField, useFormikContext } from 'formik';
import { Button, Stack } from '@stacks/ui';

import { stxToMicroStx } from '@app/common/stacks-utils';
import { LoadingKeys, useLoading } from '@app/common/hooks/use-loading';
import { useWalletType } from '@app/common/use-wallet-type';
import { useRawTxIdState } from '@app/store/transactions/raw.hooks';
import { RouteUrls } from '@shared/route-urls';

interface IncreaseFeeActionsProps {
  currentFee: number;
}
export function IncreaseFeeActions(props: IncreaseFeeActionsProps) {
  const { currentFee } = props;
  const [field] = useField('fee');
  const { handleSubmit } = useFormikContext();
  const { isLoading } = useLoading(LoadingKeys.INCREASE_FEE_DRAWER);
  const [, setRawTxId] = useRawTxIdState();
  const { whenWallet } = useWalletType();
  const navigate = useNavigate();

  const newFee = field.value;
  const isSame = currentFee === stxToMicroStx(newFee).toNumber();
  const actionText = whenWallet({ ledger: 'Confirm on Ledger', software: 'Submit' });

  const onCancel = () => {
    setRawTxId(null);
    navigate(RouteUrls.Home);
  };

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
        isDisabled={isSame}
      >
        {actionText}
      </Button>
    </Stack>
  );
}
