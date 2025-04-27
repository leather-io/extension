import { CurrentStacksAccountLoader } from '@app/components/loaders/stacks-account-loader';

interface LedgerStacksGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
export function LedgerStacksGate({ children, fallback }: LedgerStacksGateProps) {
  return (
    <CurrentStacksAccountLoader fallback={fallback}>{() => children}</CurrentStacksAccountLoader>
  );
}
