import { BitcoinNativeSegwitAccountLoader } from '@app/components/loaders/bitcoin-account-loader';
import { useHasLedgerKeys } from '@app/store/ledger/ledger.selectors';

interface LedgerBitcoinGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
export function LedgerBitcoinGate({ children, fallback }: LedgerBitcoinGateProps) {
  const isLedger = useHasLedgerKeys();
  if (!isLedger) return children;
  return (
    <BitcoinNativeSegwitAccountLoader current fallback={fallback}>
      {() => children}
    </BitcoinNativeSegwitAccountLoader>
  );
}
