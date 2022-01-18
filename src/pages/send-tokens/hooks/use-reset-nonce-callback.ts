import { useDrawers } from '@common/hooks/use-drawers';
import { LoadingKeys, useLoading } from '@common/hooks/use-loading';
import { useCustomNonce } from '@store/transactions/nonce.hooks';

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
