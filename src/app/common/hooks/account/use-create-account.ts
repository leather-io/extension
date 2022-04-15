import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useKeyActions } from '@app/common/hooks/use-key-actions';
import { useGeneratedCurrentWallet } from '@app/store/chains/stx-chain.selectors';

export function useCreateAccount() {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const { createNewAccount } = useKeyActions();
  const wallet = useGeneratedCurrentWallet();
  const analytics = useAnalytics();

  const createAccount = useCallback(async () => {
    if (wallet) {
      setIsCreatingAccount(true);
      void analytics.track('create_new_account');
      void toast.promise(createNewAccount(wallet), {
        loading: 'Creating account...',
        success: 'Account created!',
        error: 'Error creating account.',
      });
      setIsCreatingAccount(false);
    }
  }, [createNewAccount, wallet, analytics]);

  return { createAccount, isCreatingAccount };
}
