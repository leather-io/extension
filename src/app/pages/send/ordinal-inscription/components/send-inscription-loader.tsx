import type { AverageBitcoinFeeRates } from '@leather.io/models';
import { useAverageBitcoinFeeRates } from '@leather.io/query';

interface SendInscriptionLoaderProps {
  children(data: { feeRates: AverageBitcoinFeeRates }): React.JSX.Element;
}
export function SendInscriptionLoader({ children }: SendInscriptionLoaderProps) {
  const { data: feeRates } = useAverageBitcoinFeeRates();
  if (!feeRates) return null;
  return children({ feeRates });
}
