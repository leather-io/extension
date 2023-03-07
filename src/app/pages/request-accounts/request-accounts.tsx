import { RequestAccountsLayout } from './components/request-accounts.layout';
import { useRequestAccounts } from './use-request-accounts';

export function RequestAccounts() {
  const { origin, onUserApproveRequestAccounts } = useRequestAccounts();

  if (origin === null) {
    window.close();
    throw new Error('Origin is null');
  }

  const requester = new URL(origin).host;

  return (
    <RequestAccountsLayout
      requester={requester}
      onUserApproveRequestAccounts={onUserApproveRequestAccounts}
    />
  );
}
