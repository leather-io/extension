import { TransactionSigningSelectors } from '@tests/page-objects/transaction-signing.selectors';

interface TransactionFeeProps {
  fee: number | string;
}
export function TransactionFee(props: TransactionFeeProps): JSX.Element | null {
  const { fee } = props;
  return <span data-testid={TransactionSigningSelectors.FeeToBePaidLabel}>{fee} STX</span>;
}
