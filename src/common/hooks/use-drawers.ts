import {
  useAccountDrawerStep,
  useShowAccountsStore,
  useShowNetworksStore,
  useShowSettingsStore,
  useShowTxSettingsCallback,
  useShowTxSettingsStore,
} from '@store/ui/ui.hooks';

export function useDrawers() {
  const [accountStep, setAccountStep] = useAccountDrawerStep();
  const [showAccounts, setShowAccounts] = useShowAccountsStore();
  const [showNetworks, setShowNetworks] = useShowNetworksStore();
  const [showSettings, setShowSettings] = useShowSettingsStore();
  const [showTxSettings, setShowTxSettings] = useShowTxSettingsStore();
  const [showTxSettingsCallback, setShowTxSettingsCallback] = useShowTxSettingsCallback();

  return {
    accountStep,
    setAccountStep,
    showAccounts,
    setShowAccounts,
    showNetworks,
    setShowNetworks,
    showSettings,
    setShowSettings,
    showTxSettings,
    setShowTxSettings,
    showTxSettingsCallback,
    setShowTxSettingsCallback,
  };
}
