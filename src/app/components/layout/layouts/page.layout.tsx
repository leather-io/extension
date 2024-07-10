import { Outlet, useOutletContext } from 'react-router-dom';

import { SwitchAccountOutletContext } from '@shared/switch-account';

export function PageLayout() {
  const { isShowingSwitchAccount, setIsShowingSwitchAccount } =
    useOutletContext<SwitchAccountOutletContext>();
  return <Outlet context={{ isShowingSwitchAccount, setIsShowingSwitchAccount }} />;
}
