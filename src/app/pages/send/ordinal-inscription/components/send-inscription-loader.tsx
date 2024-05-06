import { useAverageBitcoinFeeRates } from '@leather-wallet/query';

import { AverageBitcoinFeeRates } from '@shared/models/fees/bitcoin-fees.model';

interface SendInscriptionLoaderProps {
  children(data: { feeRates: AverageBitcoinFeeRates }): React.JSX.Element;
}
export function SendInscriptionLoader({ children }: SendInscriptionLoaderProps) {
  const { data: feeRates } = useAverageBitcoinFeeRates();
  if (!feeRates) return null;
  return children({ feeRates });
}
