import { TransactionSigningSelectors } from '@tests/page-objects/transaction-signing.selectors';
import React from 'react';

interface TransactionFeeProps {
  fee: number | string;
  isSponsored: boolean;
}
export function TransactionFee(props: TransactionFeeProps): JSX.Element | null {
  const { fee, isSponsored } = props;
  return (
    <span data-testid={TransactionSigningSelectors.FeeToBePaidLabel}>
      {isSponsored ? '🎉 sponsored' : fee} STX
    </span>
  );
}
