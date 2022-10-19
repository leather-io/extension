import { useCallback } from 'react';
import * as React from 'react';
import { useFormikContext } from 'formik';

import { microStxToStx } from '@app/common/stacks-utils';
import { removeCommas } from '@app/common/token-utils';
import { SendFormValues } from '@app/common/transactions/transaction-utils';
import { useSelectedAsset } from '@app/pages/send-tokens/hooks/use-selected-asset';
import { useCurrentAccountAvailableStxBalance } from '@app/query/stacks/balance/balance.hooks';
import { useCurrentAccountMempoolTransactionsBalance } from '@app/query/stacks/mempool/mempool.hooks';

export function useSendAmountFieldActions() {
  const { setFieldValue, values } = useFormikContext<SendFormValues>();
  const availableStxBalance = useCurrentAccountAvailableStxBalance();
  const pendingTxsBalance = useCurrentAccountMempoolTransactionsBalance();
  const { selectedAsset, balance } = useSelectedAsset(values.assetId);
  const isStx = selectedAsset?.type === 'stx';

  const handleSetSendMax = useCallback(
    (fee: number | string) => {
      if (!selectedAsset || !balance) return;
      if (isStx && fee) {
        const stx = microStxToStx(availableStxBalance?.minus(pendingTxsBalance) || 0).minus(fee);
        if (stx.isLessThanOrEqualTo(0)) return;
        return setFieldValue('amount', stx.toNumber());
      } else {
        if (balance) setFieldValue('amount', removeCommas(balance));
      }
    },
    [selectedAsset, balance, isStx, availableStxBalance, pendingTxsBalance, setFieldValue]
  );

  const handleOnKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const hasDecimals =
        typeof selectedAsset?.meta?.decimals === 'number' && selectedAsset?.meta.decimals !== 0;
      const { key } = event;
      const value = event.currentTarget.value;
      // leading zeros
      if (
        selectedAsset?.type !== 'stx' &&
        // if no leading 0 of we don't know the status of decimals
        ((key === '0' && value.length === 0 && !hasDecimals) ||
          // only one leading zero allowed
          (key === '0' && value[0] === '0' && value[1] !== '.'))
      )
        return event.preventDefault();
      // decimals check
      if (key === '.') {
        if (!hasDecimals && selectedAsset?.type !== 'stx') return event.preventDefault();
        const hasPeriod = value.includes('.');
        // only one period allowed
        if (hasPeriod && key === '.') {
          return event.preventDefault();
        }
      }
    },
    [selectedAsset]
  );
  return {
    handleSetSendMax,
    handleOnKeyDown,
  };
}
