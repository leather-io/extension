import { closeWindow } from '@shared/utils';

import { useSwitchAccountSheet } from '@app/common/switch-account/use-switch-account-sheet-context';
import { CurrentAccountDisplayer } from '@app/features/current-account/current-account-displayer';
import { useOnOriginTabClose } from '@app/routes/hooks/use-on-tab-closed';

import { ConnectAccountLayout } from '../../components/connect-account/connect-account.layout';
import { useGetAddresses } from './use-get-addresses';

export function RpcGetAddresses() {
  const { focusInitiatingTab, origin, onUserApproveGetAddresses } = useGetAddresses();

  useOnOriginTabClose(() => closeWindow());

  const { toggleSwitchAccount } = useSwitchAccountSheet();

  if (origin === null) {
    closeWindow();
    throw new Error('Origin is null');
  }

  return (
    <ConnectAccountLayout
      requester={origin}
      onClickRequestedByLink={focusInitiatingTab}
      switchAccount={<CurrentAccountDisplayer onSelectAccount={toggleSwitchAccount} />}
      onUserApprovesGetAddresses={onUserApproveGetAddresses}
    />
  );
}
