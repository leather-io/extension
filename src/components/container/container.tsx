import React, { Suspense, useCallback, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { useWallet } from '@common/hooks/use-wallet';
import { useAuthRequest } from '@store/onboarding/onboarding.hooks';
import { usePendingTransaction } from '@store/transactions/transaction.hooks';
import { useOnCancel } from '@store/transactions/requests.hooks';

function UnmountEffectSuspense() {
  const pendingTx = usePendingTransaction();
  const { authRequest } = useAuthRequest();
  const handleCancelTransaction = useOnCancel();
  const { cancelAuthentication } = useWallet();

  /*
   * When the popup is closed, this checks the request type and forces
   * the request promise to fail; triggering an onCancel callback function.
   */
  const handleUnmount = useCallback(async () => {
    if (!!pendingTx) {
      await handleCancelTransaction();
    } else if (!!authRequest) {
      cancelAuthentication();
    }
  }, [cancelAuthentication, authRequest, pendingTx, handleCancelTransaction]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleUnmount);
    return () => window.removeEventListener('beforeunload', handleUnmount);
  }, [handleUnmount]);

  return null;
}

function UnmountEffect() {
  return (
    <Suspense fallback={<></>}>
      <UnmountEffectSuspense />
    </Suspense>
  );
}

export function Container(): JSX.Element | null {
  const { hasRehydratedVault } = useWallet();
  return hasRehydratedVault ? (
    <>
      <UnmountEffect />
      <Outlet />
    </>
  ) : null;
}
