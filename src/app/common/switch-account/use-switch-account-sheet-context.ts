import { useOutletContext } from 'react-router';

import type { SwitchAccountOutletContext } from './switch-account';

export function useSwitchAccountSheet() {
  const { isShowingSwitchAccount, setIsShowingSwitchAccount } =
    useOutletContext<SwitchAccountOutletContext>();

  return {
    isShowingSwitchAccount,
    setIsShowingSwitchAccount,
    toggleSwitchAccount() {
      setIsShowingSwitchAccount(!isShowingSwitchAccount);
    },
  };
}
