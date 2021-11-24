import React from 'react';

interface TransactionFeeProps {
  fee: number | string;
  isSponsored: boolean;
}
export function TransactionFee(props: TransactionFeeProps): JSX.Element | null {
  const { fee, isSponsored } = props;
  return <>{isSponsored ? '🎉 sponsored' : fee} STX</>;
}
