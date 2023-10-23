import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useDefaultWalletSecretKey } from '@app/store/in-memory-key/in-memory-key.selectors';
import { useCurrentKeyDetails } from '@app/store/software-keys/software-key.selectors';

function hasAlreadyMadeWalletAndPlaintextKeyInMemory(encryptedKey?: string, inMemoryKey?: string) {
  return !!encryptedKey && !!inMemoryKey;
}

function keyDetailsExistsWalletAlreadyCreatedSoPreventOnboarding(keyDetails: unknown) {
  return !!keyDetails;
}

interface OnboardingGateProps {
  children: ReactNode;
}
export function OnboardingGate({ children }: OnboardingGateProps) {
  const keyDetails = useCurrentKeyDetails();
  const currentInMemoryKey = useDefaultWalletSecretKey();

  if (
    keyDetails?.type === 'software' &&
    hasAlreadyMadeWalletAndPlaintextKeyInMemory(keyDetails.encryptedSecretKey, currentInMemoryKey)
  ) {
    return <Navigate to={RouteUrls.Home} />;
  }

  if (keyDetailsExistsWalletAlreadyCreatedSoPreventOnboarding(keyDetails))
    return <Navigate to={RouteUrls.Unlock} />;

  return <>{children}</>;
}
