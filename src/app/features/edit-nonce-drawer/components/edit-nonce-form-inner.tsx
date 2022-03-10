import { useEffect } from 'react';
import { useFormikContext } from 'formik';
import { Button, Stack } from '@stacks/ui';

import { LoadingKeys, useLoading } from '@app/common/hooks/use-loading';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { useUnsignedTxForSettingsState } from '@app/store/transactions/transaction.hooks';

import { EditNonceField } from './edit-nonce-field';

export function EditNonceFormInner(): JSX.Element {
  const { setFieldValue, handleSubmit } = useFormikContext();
  const { isLoading } = useLoading(LoadingKeys.EDIT_NONCE_DRAWER);
  const transaction = useUnsignedTxForSettingsState();
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
          _hover={{ boxShadow: 'none' }}
          borderRadius="10px"
          boxShadow="none"
          flexGrow={1}
          mode="tertiary"
          onClick={() => setShowEditNonce(false)}
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
