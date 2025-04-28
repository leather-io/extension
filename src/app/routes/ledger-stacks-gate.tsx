import { ConnectLedgerStacks } from '@app/features/ledger/generic-steps/connect-device/connect-ledger-stacks';
import { useHasLedgerKeys, useHasLedgerStacksKeys } from '@app/store/ledger/ledger.selectors';

interface LedgerStacksGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
export function LedgerStacksGate({
  children,
  fallback = <ConnectLedgerStacks />,
}: LedgerStacksGateProps) {
  const isLedger = useHasLedgerKeys();
  const hasLedgerStacksKeys = useHasLedgerStacksKeys();
  if (!isLedger || hasLedgerStacksKeys) return children;
  return fallback;
}
