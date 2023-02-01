import { useCallback } from 'react';
import { toast } from 'react-hot-toast';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useKeyActions } from '@app/common/hooks/use-key-actions';
import { useStacksWallet } from '@app/store/accounts/blockchain/stacks/stacks-keychain';

export function useCreateAccount() {
  const { createNewAccount } = useKeyActions();
  const wallet = useStacksWallet();
  const analytics = useAnalytics();

  return useCallback(() => {
    if (wallet) {
      void analytics.track('create_new_account');
      void toast.promise(createNewAccount(wallet), {
        loading: 'Creating account...',
        success: 'Account created!',
        error: 'Error creating account.',
      });
    }
  }, [wallet, analytics, createNewAccount]);
}
