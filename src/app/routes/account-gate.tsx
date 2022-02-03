import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';
import { useCurrentKeyDetails, useGeneratedSecretKey } from '@app/store/keys/key.selectors';
import { useDefaultWalletSecretKey } from '@app/store/in-memory-key/in-memory-key.selectors';

interface AccountGateProps {
  children?: ReactNode;
}
export const AccountGate = ({ children }: AccountGateProps) => {
  const currentKeyDetails = useCurrentKeyDetails();
  const yetToBeEncryptedKey = useGeneratedSecretKey();
  const currentInMemorySecretKey = useDefaultWalletSecretKey();

  const generatedKeyButNotYetEncrypted = !currentKeyDetails && yetToBeEncryptedKey;
  const newlyCreatedWallet = !currentKeyDetails;
  const hasGeneratedWalletButItsLocked = !currentInMemorySecretKey;

  if (generatedKeyButNotYetEncrypted) return <Navigate to={RouteUrls.BackUpSecretKey} />;
  if (newlyCreatedWallet) return <Navigate to={RouteUrls.Onboarding} />;
  if (hasGeneratedWalletButItsLocked) return <Navigate to={RouteUrls.Unlock} />;

  return <>{children}</>;
};
