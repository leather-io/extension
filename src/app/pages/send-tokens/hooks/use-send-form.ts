import { useCallback } from 'react';
import * as React from 'react';

import { useFormikContext } from 'formik';

import { SendFormValues } from '@shared/models/form.model';

import { useSelectedAssetBalance } from '@app/common/hooks/use-selected-asset-balance';
import { convertAmountToBaseUnit } from '@app/common/money/calculate-money';
import { microStxToStx } from '@app/common/money/unit-conversion';
import { useCurrentStacksAccountAnchoredBalances } from '@app/query/stacks/balance/balance.hooks';
import { useCurrentAccountMempoolTransactionsBalance } from '@app/query/stacks/mempool/mempool.hooks';

export function useSendAmountFieldActions() {
  const { setFieldValue, values } = useFormikContext<SendFormValues>();
  const { data: stacksBalances } = useCurrentStacksAccountAnchoredBalances();
  const pendingTxsBalance = useCurrentAccountMempoolTransactionsBalance();
  const { isStx, selectedAssetBalance } = useSelectedAssetBalance(values.assetId);

  const handleSetSendMax = useCallback(
    (fee: number | string) => {
      if (!selectedAssetBalance) return;
      if (isStx && fee) {
        const stx = microStxToStx(
          stacksBalances?.stx.availableStx.amount.minus(pendingTxsBalance) || 0
        ).minus(fee);
        if (stx.isLessThanOrEqualTo(0)) return;
        return setFieldValue('amount', stx.toNumber());
      }
      setFieldValue('amount', convertAmountToBaseUnit(selectedAssetBalance.balance).toString());
    },
    [
      selectedAssetBalance,
      isStx,
      setFieldValue,
      stacksBalances?.stx.availableStx.amount,
      pendingTxsBalance,
    ]
  );

  const handleOnKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const hasDecimals =
        typeof selectedAssetBalance?.asset.decimals === 'number' &&
        selectedAssetBalance.asset.decimals !== 0;
      const { key } = event;
      const value = event.currentTarget.value;
      // leading zeros
      if (
        isStx &&
        // if no leading 0 of we don't know the status of decimals
        ((key === '0' && value.length === 0 && !hasDecimals) ||
          // only one leading zero allowed
          (key === '0' && value[0] === '0' && value[1] !== '.'))
      )
        return event.preventDefault();
      // decimals check
      if (key === '.') {
        if (!hasDecimals && !isStx) return event.preventDefault();
        const hasPeriod = value.includes('.');
        // only one period allowed
        if (hasPeriod && key === '.') {
          return event.preventDefault();
        }
      }
    },
    [isStx, selectedAssetBalance]
  );
  return {
    handleSetSendMax,
    handleOnKeyDown,
  };
}
