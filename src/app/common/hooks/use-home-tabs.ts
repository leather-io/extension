import { useTabState } from '@app/store/ui/ui.hooks';

export function useHomeTabs() {
  const [activeTab, setActiveTab] = useTabState('HOME_TABS');
  const setActiveTabBalances = () => setActiveTab(0);
  const setActiveTabActivity = () => setActiveTab(1);
  return {
    activeTab,
    setActiveTab,
    setActiveTabBalances,
    setActiveTabActivity,
  };
}
