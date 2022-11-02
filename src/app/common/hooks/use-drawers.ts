import {
  useShowSwitchAccountsState,
  useShowHighFeeConfirmationState,
  useShowSettingsStore,
  useShowTxSettingsCallback,
  useShowEditNonceState,
} from '@app/store/ui/ui.hooks';

export function useDrawers() {
  const [showAccounts, setShowSwitchAccountsState] = useShowSwitchAccountsState();
  const [showHighFeeConfirmation, setShowHighFeeConfirmation] = useShowHighFeeConfirmationState();

  const [showSettings, setShowSettings] = useShowSettingsStore();
  const [showEditNonce, setShowEditNonce] = useShowEditNonceState();
  const [showTxSettingsCallback, setShowTxSettingsCallback] = useShowTxSettingsCallback();

  return {
    showAccounts,
    setShowSwitchAccountsState,
    showHighFeeConfirmation,
    setShowHighFeeConfirmation,

    showSettings,
    setShowSettings,
    showEditNonce,
    setShowEditNonce,
    showTxSettingsCallback,
    setShowTxSettingsCallback,
  };
}
