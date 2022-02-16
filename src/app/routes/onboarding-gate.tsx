import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';
import { useCurrentKeyDetails } from '@app/store/keys/key.selectors';
import { useDefaultWalletSecretKey } from '@app/store/in-memory-key/in-memory-key.selectors';

function hasAlreadyMadeWalletAndPlaintextKeyInMemory(encryptedKey?: string, inMemoryKey?: string) {
  return !!encryptedKey && !!inMemoryKey;
}

interface OnboardingGateProps {
  children: ReactNode;
}
export const OnboardingGate = ({ children }: OnboardingGateProps) => {
  const keyDetails = useCurrentKeyDetails();
  const currentInMemoryKey = useDefaultWalletSecretKey();

  if (
    keyDetails?.type === 'software' &&
    hasAlreadyMadeWalletAndPlaintextKeyInMemory(keyDetails.encryptedSecretKey, currentInMemoryKey)
  ) {
    return <Navigate to={RouteUrls.Home} />;
  }

  return <>{children}</>;
};
