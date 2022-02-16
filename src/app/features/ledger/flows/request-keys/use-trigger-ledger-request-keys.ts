import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { keySlice } from '@app/store/keys/key.slice';
import { InternalMethods } from '@shared/message-types';
import { sendMessage } from '@shared/messages';
import { RouteUrls } from '@shared/route-urls';

export function useTriggerLedgerDeviceRequestKeys() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMemo(
    () => ({
      fireErrorMessageToast(errorMsg: string) {
        toast.error(errorMsg);
      },
      completeLedgerDeviceOnboarding(publicKeys: string[], targetId: string) {
        dispatch(
          keySlice.actions.createLedgerWallet({
            type: 'ledger',
            id: 'default',
            targetId,
            publicKeys,
          })
        );
        // It's possible a user may have first generated a key, then decided
        // they wanted to pair with Ledger Here, we kill all in memory keys when
        // a new Ledger wallet is created
        sendMessage({ method: InternalMethods.RemoveInMemoryKeys, payload: undefined });
        navigate(RouteUrls.Home);
      },
    }),
    [dispatch, navigate]
  );
}
