import { useNextNonce } from '@leather.io/query';

import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

interface StacksNonceLoaderProps {
  children(nonce: number | string): React.ReactNode;
}
export function StacksNonceLoader({ children }: StacksNonceLoaderProps) {
  const stxAddress = useCurrentStacksAccountAddress();
  const { data: nextNonce } = useNextNonce(stxAddress);

  if (!nextNonce) return null;
  return children(nextNonce?.nonce ?? '');
}
