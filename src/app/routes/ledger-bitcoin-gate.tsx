import { BitcoinNativeSegwitAccountLoader } from '@app/components/loaders/bitcoin-account-loader';

interface LedgerBitcoinGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
export function LedgerBitcoinGate({ children, fallback }: LedgerBitcoinGateProps) {
  return (
    <BitcoinNativeSegwitAccountLoader current fallback={fallback}>
      {() => children}
    </BitcoinNativeSegwitAccountLoader>
  );
}
