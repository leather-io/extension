import { Outlet, useOutletContext } from 'react-router-dom';

import { SwitchAccountOutletContext } from '@shared/switch-account';

import { Content } from '../layouts/content.layout';

export function HomeLayout() {
  const { isShowingSwitchAccount, setIsShowingSwitchAccount } =
    useOutletContext<SwitchAccountOutletContext>();
  return (
    <Content>
      <Outlet context={{ isShowingSwitchAccount, setIsShowingSwitchAccount }} />
    </Content>
  );
}
