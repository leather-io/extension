import {
  useShowEditNonceState,
  useShowHighFeeConfirmationState,
  useShowSettingsStore,
  useShowSwitchAccountsState,
  useShowTxSettingsCallback,
} from '@app/store/ui/ui.hooks';

export function useDrawers() {
  const [isShowingAccounts, setIsShowingSwitchAccountsState] = useShowSwitchAccountsState();
  const [isShowingHighFeeConfirmation, setIsShowingHighFeeConfirmation] =
    useShowHighFeeConfirmationState();

  const [isShowingSettings, setIsShowingSettings] = useShowSettingsStore();
  const [isShowingEditNonce, setIsShowingEditNonce] = useShowEditNonceState();
  const [isShowingTxSettingsCallback, setIsShowingTxSettingsCallback] = useShowTxSettingsCallback();

  return {
    isShowingAccounts,
    setIsShowingSwitchAccountsState,
    isShowingHighFeeConfirmation,
    setIsShowingHighFeeConfirmation,

    isShowingSettings,
    setIsShowingSettings,
    isShowingEditNonce,
    setIsShowingEditNonce,
    isShowingTxSettingsCallback,
    setIsShowingTxSettingsCallback,
  };
}
