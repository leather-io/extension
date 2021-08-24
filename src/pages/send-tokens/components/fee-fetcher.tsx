import { useCurrentFee } from '@store/common/common.hooks';

interface FeeFetcherProps {
  children(fee: number): JSX.Element;
}
export function FeeFetcher({ children }: FeeFetcherProps) {
  const fee = useCurrentFee();
  return children(fee);
}
