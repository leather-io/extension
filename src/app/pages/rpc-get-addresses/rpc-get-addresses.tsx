import { closeWindow } from '@shared/utils';

import { GetAddressesLayout } from './components/get-addresses.layout';
import { useGetAddresses } from './use-request-accounts';

export function RpcGetAddresses() {
  const { origin, onUserApproveGetAddresses } = useGetAddresses();

  if (origin === null) {
    closeWindow();
    throw new Error('Origin is null');
  }

  const requester = new URL(origin).host;

  return (
    <GetAddressesLayout
      requester={requester}
      onUserApproveGetAddresses={onUserApproveGetAddresses}
    />
  );
}
