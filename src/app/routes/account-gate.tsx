import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { useWallet } from '@app/common/hooks/use-wallet';

import { RouteUrls } from '@shared/route-urls';
interface AccountGateProps {
  children?: ReactNode;
}
export const AccountGate = ({ children }: AccountGateProps) => {
  const { encryptedSecretKey, hasGeneratedWallet, hasSetPassword } = useWallet();

  const isWalletActive = (hasGeneratedWallet || encryptedSecretKey) && hasSetPassword;
  const isWalletLocked = !hasGeneratedWallet && encryptedSecretKey;
  const needsToCompleteOnboarding = (hasGeneratedWallet || encryptedSecretKey) && !hasSetPassword;

  if (isWalletActive) return <>{children}</>;
  if (isWalletLocked) return <Navigate to={RouteUrls.Unlock} />;
  if (needsToCompleteOnboarding) return <Navigate to={RouteUrls.BackUpSecretKey} />;
  if (isWalletActive) return <>{children}</>;

  return null;
};
