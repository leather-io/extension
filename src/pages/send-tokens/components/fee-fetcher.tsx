import { useCurrentFee } from '@store/transactions/fees.hooks';

interface FeeFetcherProps {
  children(fee: number): JSX.Element;
}
export function FeeFetcher({ children }: FeeFetcherProps) {
  const fee = useCurrentFee();
  return children(fee);
}
