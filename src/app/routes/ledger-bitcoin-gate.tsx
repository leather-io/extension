import { ConnectLedgerBitcoin } from '@app/features/ledger/generic-steps/connect-device/connect-ledger-bitcoin';
import { useHasLedgerBitcoinKeys, useHasLedgerKeys } from '@app/store/ledger/ledger.selectors';

interface LedgerBitcoinGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
export function LedgerBitcoinGate({
  children,
  fallback = <ConnectLedgerBitcoin />,
}: LedgerBitcoinGateProps) {
  const isLedger = useHasLedgerKeys();
  const hasLedgerBitcoinKeys = useHasLedgerBitcoinKeys();
  if (!isLedger || hasLedgerBitcoinKeys) return children;
  return fallback;
}
