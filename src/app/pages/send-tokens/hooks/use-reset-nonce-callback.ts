import { useDrawers } from '@app/common/hooks/use-drawers';
import { LoadingKeys, useLoading } from '@app/common/hooks/use-loading';
import { useCustomNonce } from '@app/store/transactions/nonce.hooks';

export const useResetNonceCallback = () => {
  const { showEditNonce, setShowEditNonce } = useDrawers();

  const { isLoading, setIsIdle } = useLoading(LoadingKeys.EDIT_NONCE_DRAWER);
  const [, setCustomNonce] = useCustomNonce();

  return () => {
    if (showEditNonce) setShowEditNonce(false);
    setCustomNonce(undefined);
    if (isLoading) setIsIdle();
  };
};
