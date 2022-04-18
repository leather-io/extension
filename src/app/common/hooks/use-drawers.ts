import {
  useShowSwitchAccountsState,
  useShowHighFeeConfirmationState,
  useShowNetworksStore,
  useShowSettingsStore,
  useShowSignOut,
  useShowTxSettingsCallback,
  useShowEditNonceState,
} from '@app/store/ui/ui.hooks';

export function useDrawers() {
  const [showAccounts, setShowSwitchAccountsState] = useShowSwitchAccountsState();
  const [showHighFeeConfirmation, setShowHighFeeConfirmation] = useShowHighFeeConfirmationState();
  const [showNetworks, setShowNetworks] = useShowNetworksStore();
  const [showSettings, setShowSettings] = useShowSettingsStore();
  const [showEditNonce, setShowEditNonce] = useShowEditNonceState();
  const [showTxSettingsCallback, setShowTxSettingsCallback] = useShowTxSettingsCallback();
  const [showSignOut, setShowSignOut] = useShowSignOut();

  return {
    showAccounts,
    setShowSwitchAccountsState,
    showHighFeeConfirmation,
    setShowHighFeeConfirmation,
    showNetworks,
    setShowNetworks,
    showSettings,
    setShowSettings,
    showEditNonce,
    setShowEditNonce,
    showTxSettingsCallback,
    setShowTxSettingsCallback,
    showSignOut,
    setShowSignOut,
  };
}
