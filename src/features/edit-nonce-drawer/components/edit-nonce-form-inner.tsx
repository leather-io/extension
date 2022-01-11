import { useEffect } from 'react';
import { useFormikContext } from 'formik';
import { Button, Stack } from '@stacks/ui';

import { LoadingKeys, useLoading } from '@common/hooks/use-loading';
import { useDrawers } from '@common/hooks/use-drawers';
import { useUnsignedTxForSettingsState } from '@store/transactions/transaction.hooks';

import { EditNonceField } from './edit-nonce-field';

export function EditNonceFormInner(): JSX.Element {
  const { setFieldValue, handleSubmit } = useFormikContext();
  const { isLoading } = useLoading(LoadingKeys.EDIT_NONCE_DRAWER);
  const [transaction] = useUnsignedTxForSettingsState();
  const nonce = Number(transaction?.auth.spendingCondition?.nonce);
  const { setShowEditNonce } = useDrawers();

  useEffect(() => {
    setFieldValue('nonce', nonce);
  }, [setFieldValue, nonce]);

  return (
    <>
      <Stack>
        <EditNonceField />
      </Stack>
      <Stack isInline>
        <Button
          onClick={() => setShowEditNonce(false)}
          flexGrow={1}
          borderRadius="10px"
          mode="tertiary"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          flexGrow={1}
          onClick={handleSubmit}
          isLoading={isLoading}
          borderRadius="10px"
        >
          Apply
        </Button>
      </Stack>
    </>
  );
}
