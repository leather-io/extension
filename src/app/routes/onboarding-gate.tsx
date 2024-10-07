import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useHasDefaultInMemoryWalletSecretKey } from '@app/store/in-memory-key/in-memory-key.selectors';
import { useHasLedgerKeys } from '@app/store/ledger/ledger.selectors';
import { useCurrentKeyDetails } from '@app/store/software-keys/software-key.selectors';

function hasAlreadyMadeWalletAndPlaintextKeyInMemory(
  hasInMemorySecretKey: boolean,
  encryptedKey?: string
) {
  return hasInMemorySecretKey && !!encryptedKey;
}

function keyDetailsExistsWalletAlreadyCreatedSoPreventOnboarding(keyDetails: unknown) {
  return !!keyDetails;
}

interface OnboardingGateProps {
  children: ReactNode;
}
export function OnboardingGate({ children }: OnboardingGateProps) {
  const keyDetails = useCurrentKeyDetails();
  const hasInMemorySecretKey = useHasDefaultInMemoryWalletSecretKey();
  const isLedger = useHasLedgerKeys();

  if (
    (keyDetails?.type === 'software' &&
      hasAlreadyMadeWalletAndPlaintextKeyInMemory(
        hasInMemorySecretKey,
        keyDetails.encryptedSecretKey
      )) ||
    isLedger
  ) {
    return <Navigate to={RouteUrls.Home} />;
  }

  if (keyDetailsExistsWalletAlreadyCreatedSoPreventOnboarding(keyDetails))
    return <Navigate to={RouteUrls.Unlock} />;

  return <>{children}</>;
}
