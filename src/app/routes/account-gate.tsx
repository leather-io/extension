import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';
import { useCurrentKeyDetails, useGeneratedSecretKey } from '@app/store/keys/key.selectors';
import { useDefaultWalletSecretKey } from '@app/store/in-memory-key/in-memory-key.selectors';

export function shouldNavigateBackToBackupSecretKeyPage(
  currentKeyDetails: any,
  yetToBeEncryptedKey?: string | null
) {
  return !currentKeyDetails && yetToBeEncryptedKey;
}

export function shouldNavigateToOnboardingStartPage(currentKeyDetails?: any) {
  return !currentKeyDetails;
}

export function shouldNavigateToUnlockWalletPage(currentInMemorySecretKey?: string) {
  return !currentInMemorySecretKey;
}

interface AccountGateProps {
  children?: ReactNode;
}
export const AccountGate = ({ children }: AccountGateProps) => {
  const currentKeyDetails = useCurrentKeyDetails();
  const yetToBeEncryptedKey = useGeneratedSecretKey();
  const currentInMemorySecretKey = useDefaultWalletSecretKey();

  if (shouldNavigateBackToBackupSecretKeyPage(currentKeyDetails, yetToBeEncryptedKey))
    return <Navigate to={RouteUrls.BackUpSecretKey} />;

  if (shouldNavigateToOnboardingStartPage(currentKeyDetails))
    return <Navigate to={RouteUrls.Onboarding} />;

  if (shouldNavigateToUnlockWalletPage(currentInMemorySecretKey))
    return <Navigate to={RouteUrls.Unlock} />;

  return <>{children}</>;
};
