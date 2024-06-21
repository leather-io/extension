import { useCallback, useMemo, useState } from 'react';

import type { ToastProps } from '@leather.io/ui';

export function useToastHandlers() {
  const [toasts, setToasts] = useState(new Map());

  const handleAddToast = useCallback((toast: ToastProps) => {
    setToasts(prev => {
      const newMap = new Map(prev);
      newMap.set(String(Date.now()), { ...toast });
      return newMap;
    });
  }, []);

  return useMemo(() => {
    return {
      toasts,
      handleRemoveToast: (key: any) => {
        setToasts(prev => {
          const newMap = new Map(prev);
          newMap.delete(key);
          return newMap;
        });
      },
      handleDispatchInfo: (message: string) => handleAddToast({ message, variant: 'info' }),
      handleDispatchSuccess: (message: string) => handleAddToast({ message, variant: 'success' }),
      handleDispatchError: (message: string) => handleAddToast({ message, variant: 'error' }),
      handleDispatchPromise: async (
        promise: Promise<any>,
        msgs: { success: string; error: string }
      ) => {
        return promise
          .then(data => {
            handleAddToast({ message: msgs.success, variant: 'success' });
            return data;
          })
          .catch(() => {
            handleAddToast({ message: msgs.error, variant: 'error' });
          });
      },
    };
  }, [handleAddToast, toasts]);
}
