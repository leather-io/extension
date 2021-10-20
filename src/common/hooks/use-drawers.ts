import {
  useAccountDrawerStep,
  useShowAccountsStore,
  useShowNetworksStore,
  useShowSettingsStore,
  useShowSignOut,
  useShowTxSettingsCallback,
  useShowEditNonceState,
} from '@store/ui/ui.hooks';

export function useDrawers() {
  const [accountStep, setAccountStep] = useAccountDrawerStep();
  const [showAccounts, setShowAccounts] = useShowAccountsStore();
  const [showNetworks, setShowNetworks] = useShowNetworksStore();
  const [showSettings, setShowSettings] = useShowSettingsStore();
  const [showEditNonce, setShowEditNonce] = useShowEditNonceState();
  const [showTxSettingsCallback, setShowTxSettingsCallback] = useShowTxSettingsCallback();
  const [showSignOut, setShowSignOut] = useShowSignOut();

  return {
    accountStep,
    setAccountStep,
    showAccounts,
    setShowAccounts,
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
