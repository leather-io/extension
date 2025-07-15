import { Outlet } from 'react-router';

import { useSwitchAccountSheet } from '@app/common/switch-account/use-switch-account-sheet-context';

export function SwitchAccountLayout() {
  const { isShowingSwitchAccount, setIsShowingSwitchAccount } = useSwitchAccountSheet();
  return <Outlet context={{ isShowingSwitchAccount, setIsShowingSwitchAccount }} />;
}
