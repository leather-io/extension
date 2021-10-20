import React from 'react';
import { AuthType } from '@stacks/transactions';

import { stacksValue } from '@common/stacks-utils';
import { useTxForSettingsState } from '@store/transactions/transaction.hooks';
import { useFeeState } from '@store/transactions/fees.hooks';

export function TransactionFee(): JSX.Element | null {
  /** @deprecated */
  const [transaction] = useTxForSettingsState();
  const [fee] = useFeeState();
  const isSponsored = transaction?.auth?.authType === AuthType.Sponsored;

  if (!fee) return null;

  return (
    <>
      {isSponsored
        ? '🎉 sponsored'
        : stacksValue({
            value: fee,
            fixedDecimals: true,
          })}
    </>
  );
}
