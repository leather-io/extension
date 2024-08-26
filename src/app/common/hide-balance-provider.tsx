import { createContext, useContext } from 'react';

interface HideBalanceContextProps {
  hideBalance?: boolean;
}
const hideBalanceProvider = createContext<HideBalanceContextProps | null>(null);

const { Provider } = hideBalanceProvider;

export function useHideBalanceContext() {
  return !!useContext(hideBalanceProvider)?.hideBalance;
}

interface HideBalanceProviderProps {
  children: React.ReactNode;
  hideBalance?: boolean;
}
export function HideBalanceProvider({ children, hideBalance }: HideBalanceProviderProps) {
  return <Provider value={{ hideBalance }}>{children}</Provider>;
}
