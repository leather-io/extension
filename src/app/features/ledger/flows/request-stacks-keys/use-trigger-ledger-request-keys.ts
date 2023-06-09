import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

import { keySlice } from '@app/store/keys/key.slice';

import { StxAndIdentityPublicKeys } from '../../utils/stacks-ledger-utils';

export function useTriggerLedgerDeviceRequestStacksKeys() {
  const dispatch = useDispatch();

  return useMemo(
    () => ({
      fireErrorMessageToast(errorMsg: string) {
        toast.error(errorMsg);
      },
      completeLedgerDeviceOnboarding(publicKeys: StxAndIdentityPublicKeys[], targetId: string) {
        dispatch(
          keySlice.actions.createNewStacksLedgerWallet({
            type: 'ledger',
            id: 'default',
            targetId,
            publicKeys,
          })
        );
      },
    }),
    [dispatch]
  );
}
