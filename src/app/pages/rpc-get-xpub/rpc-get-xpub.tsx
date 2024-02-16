import { closeWindow } from '@shared/utils';

import { GetXpubLayout } from './components/get-xpub.layout';
import { useGetXpub } from './use-request-accounts';

export function RpcGetXpub() {
  const { origin, onUserApproveGetXpub } = useGetXpub();

  if (origin === null) {
    closeWindow();
    throw new Error('Origin is null');
  }

  const requester = new URL(origin).host;

  return <GetXpubLayout requester={requester} onUserApproveGetXpub={onUserApproveGetXpub} />;
}
