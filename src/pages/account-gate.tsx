import React, { memo } from 'react';
import { useWallet } from '@common/hooks/use-wallet';

import { Navigate, useLocation } from 'react-router-dom';
import { RouteUrls } from '@common/types';

// enum Step {
//   VIEW_KEY = 1,
//   SET_PASSWORD = 2,
// }

export const AccountGate: React.FC = memo(({ children }) => {
  const location = useLocation();
  console.log({ location });
  const { hasRehydratedVault, hasSetPassword, isSignedIn, encryptedSecretKey } = useWallet();

  if (!hasRehydratedVault) return null;
  if (isSignedIn && hasSetPassword) return <>{children}</>;

  const needsToSetPassword = (isSignedIn || encryptedSecretKey) && !hasSetPassword;

  if (needsToSetPassword) {
    return <Navigate to={RouteUrls.InstalledSaveKey} />;
    // if (step === Step.VIEW_KEY) {
    // return <SaveYourKeyView hideActions handleNext={() => setStep(Step.SET_PASSWORD)} />;
    // }
    //  else if (step === Step.SET_PASSWORD) {
    //   return <SetPasswordPage />;
    // }
  }
  if (!isSignedIn && encryptedSecretKey) {
    console.log('navigating in gate to unlcok page');
    return <Navigate to={RouteUrls.Unlock} state={{ path: location.pathname + location.search }} />;
  }
  return <Navigate to={RouteUrls.SignedOut} />;
});
