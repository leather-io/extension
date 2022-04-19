import { memo, useCallback, useEffect, useState } from 'react';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { useWallet } from '@app/common/hooks/use-wallet';
import { useAppDetails } from '@app/common/hooks/auth/use-app-details';
import { Header } from '@app/components/header';
import { AccountPicker } from '@app/features/account-picker/accounts';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { useAccounts } from '@app/store/accounts/account.hooks';
import { AccountPickerLayout } from '@app/features/account-picker/account-picker.layout';

export const AuthenticateAccount = memo(() => {
  const accounts = useAccounts();
  const { name: appName } = useAppDetails();
  const { decodedAuthRequest } = useOnboardingState();
  const { cancelAuthentication, wallet, finishSignIn } = useWallet();
  const [selectedAccountIndex, setSelectedAccountIndex] = useState<number | null>(null);

  useRouteHeader(<Header hideActions />);

  const signIntoAccount = async (index: number) => {
    setSelectedAccountIndex(index);
    await finishSignIn(index);
  };

  const handleUnmount = useCallback(async () => {
    cancelAuthentication();
  }, [cancelAuthentication]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleUnmount);
    return () => window.removeEventListener('beforeunload', handleUnmount);
  }, [handleUnmount]);

  if (!wallet || !accounts || !decodedAuthRequest) return null;

  return (
    <AccountPickerLayout appName={appName}>
      <AccountPicker
        onAccountSelected={index => signIntoAccount(index)}
        selectedAccountIndex={selectedAccountIndex}
      />
    </AccountPickerLayout>
  );
});
