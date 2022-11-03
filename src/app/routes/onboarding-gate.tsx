import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useDefaultWalletSecretKey } from '@app/store/in-memory-key/in-memory-key.selectors';
import { useCurrentKeyDetails } from '@app/store/keys/key.selectors';
import { useHasUserRespondedToAnalyticsConsent } from '@app/store/settings/settings.selectors';

function hasAlreadyMadeWalletAndPlaintextKeyInMemory(encryptedKey?: string, inMemoryKey?: string) {
  return !!encryptedKey && !!inMemoryKey;
}

interface OnboardingGateProps {
  children: ReactNode;
}
export const OnboardingGate = ({ children }: OnboardingGateProps) => {
  const { pathname } = useLocation();
  const hasResponded = useHasUserRespondedToAnalyticsConsent();
  const keyDetails = useCurrentKeyDetails();
  const currentInMemoryKey = useDefaultWalletSecretKey();

  if (!hasResponded && pathname !== RouteUrls.RequestDiagnostics) {
    return <Navigate to={RouteUrls.RequestDiagnostics} />;
  }

  if (
    keyDetails?.type === 'software' &&
    hasAlreadyMadeWalletAndPlaintextKeyInMemory(keyDetails.encryptedSecretKey, currentInMemoryKey)
  ) {
    return <Navigate to={RouteUrls.Home} />;
  }

  return <>{children}</>;
};
