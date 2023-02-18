import { useCallback } from 'react';
import { toast } from 'react-hot-toast';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useKeyActions } from '@app/common/hooks/use-key-actions';

export function useCreateAccount() {
  const { createNewAccount } = useKeyActions();
  const analytics = useAnalytics();

  return useCallback(() => {
    void analytics.track('create_new_account');
    void toast.promise(createNewAccount(), {
      loading: 'Creating account...',
      success: 'Account created!',
      error: 'Error creating account.',
    });
  }, [analytics, createNewAccount]);
}
