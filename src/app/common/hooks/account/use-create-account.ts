import { useCallback } from 'react';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useKeyActions } from '@app/common/hooks/use-key-actions';
import { useToast } from '@app/features/toasts/use-toast';

export function useCreateAccount() {
  const { createNewAccount } = useKeyActions();
  const analytics = useAnalytics();
  const toast = useToast();

  return useCallback(() => {
    void analytics.track('create_new_account');
    void toast.promise(createNewAccount(), {
      success: 'Account created!',
      error: 'Error creating account.',
    });
  }, [analytics, createNewAccount, toast]);
}
