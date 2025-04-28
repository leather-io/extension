import { CurrentStacksAccountLoader } from '@app/components/loaders/stacks-account-loader';
import { useHasLedgerKeys } from '@app/store/ledger/ledger.selectors';

interface LedgerStacksGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
export function LedgerStacksGate({ children, fallback }: LedgerStacksGateProps) {
  const isLedger = useHasLedgerKeys();
  if (!isLedger) return children;
  return (
    <CurrentStacksAccountLoader fallback={fallback}>{() => children}</CurrentStacksAccountLoader>
  );
}
