import React from 'react';
import { Navigate } from 'react-router-dom';

import { useWallet } from '@common/hooks/use-wallet';
import { RouteUrls } from './route-urls';
interface AccountGateProps {
  children?: React.ReactNode;
}
export const AccountGate = ({ children }: AccountGateProps) => {
  const { encryptedSecretKey, hasGeneratedWallet, hasRehydratedVault, hasSetPassword } =
    useWallet();

  const isWalletActive = hasGeneratedWallet && hasSetPassword;
  const isWalletLocked = !hasGeneratedWallet && encryptedSecretKey;

  if (!hasRehydratedVault) return null;
  if (isWalletActive) return <>{children}</>;
  if (isWalletLocked) return <Navigate to={RouteUrls.Unlock} />;

  return null;
};
