import React from 'react';
import { AuthType } from '@stacks/transactions';

import { useUnsignedTxForSettingsState } from '@store/transactions/transaction.hooks';

interface TransactionFeeProps {
  fee: number | string;
}
export function TransactionFee(props: TransactionFeeProps): JSX.Element | null {
  const { fee } = props;
  /** @deprecated */
  const [transaction] = useUnsignedTxForSettingsState();
  const isSponsored = transaction?.auth?.authType === AuthType.Sponsored;

  return <>{isSponsored ? '🎉 sponsored' : fee} STX</>;
}
