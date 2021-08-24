import {
  useAccountDrawerStep,
  useShowAccountsStore,
  useShowNetworksStore,
  useShowSettingsStore,
} from '@store/ui/ui.hooks';

export function useDrawers() {
  const [accountStep, setAccountStep] = useAccountDrawerStep();
  const [showAccounts, setShowAccounts] = useShowAccountsStore();
  const [showNetworks, setShowNetworks] = useShowNetworksStore();
  const [showSettings, setShowSettings] = useShowSettingsStore();

  return {
    accountStep,
    setAccountStep,
    showAccounts,
    setShowAccounts,
    showNetworks,
    setShowNetworks,
    showSettings,
    setShowSettings,
  };
}
