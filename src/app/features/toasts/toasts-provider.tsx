import { useMemo } from 'react';

import { Toast, ToastLayout } from '@leather.io/ui';

import type { HasChildren } from '@app/common/has-children';

import { ToastContext } from './use-toast';
import { useToastHandlers } from './use-toast-handlers';

function ToastsProvider(props: HasChildren) {
  const { children } = props;

  const {
    toasts,
    handleRemoveToast,
    handleDispatchError,
    handleDispatchInfo,
    handleDispatchSuccess,
    handleDispatchPromise,
  } = useToastHandlers();

  return (
    <ToastContext.Provider
      value={useMemo(
        () => ({
          error: handleDispatchError,
          info: handleDispatchInfo,
          success: handleDispatchSuccess,
          promise: handleDispatchPromise,
        }),
        [handleDispatchError, handleDispatchInfo, handleDispatchSuccess, handleDispatchPromise]
      )}
    >
      <Toast.Provider duration={2000}>
        {children}
        {Array.from(toasts).map(([key, toast]) => (
          <Toast.Root
            asChild
            forceMount
            key={key}
            onOpenChange={open => {
              if (!open) handleRemoveToast(key);
            }}
          >
            <Toast.Title>
              <ToastLayout message={toast.message} variant={toast.variant} />
            </Toast.Title>
          </Toast.Root>
        ))}
        <Toast.Viewport />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}

export { ToastsProvider };
