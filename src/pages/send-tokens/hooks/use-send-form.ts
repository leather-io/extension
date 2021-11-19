import React, { useCallback } from 'react';
import { FormikProps } from 'formik';

import { useSelectedAsset } from '@common/hooks/use-selected-asset';
import { microStxToStx } from '@common/stacks-utils';
import { removeCommas } from '@common/token-utils';
import { TransactionFormValues } from '@common/transactions/transaction-utils';
import { useCurrentAccountAvailableStxBalance } from '@store/accounts/account.hooks';

export function useSendAmountFieldActions({
  setFieldValue,
}: Pick<FormikProps<TransactionFormValues>, 'setFieldValue'>) {
  const availableStxBalance = useCurrentAccountAvailableStxBalance();
  const { selectedAsset, balance } = useSelectedAsset();
  const isStx = selectedAsset?.type === 'stx';

  const handleSetSendMax = useCallback(
    (fee: number | string) => {
      if (!selectedAsset || !balance) return;
      if (isStx && fee) {
        const stx = microStxToStx(availableStxBalance || 0).minus(microStxToStx(fee));
        if (stx.isLessThanOrEqualTo(0)) return;
        return setFieldValue('amount', stx.toNumber());
      } else {
        if (balance) setFieldValue('amount', removeCommas(balance));
      }
    },
    [selectedAsset, balance, isStx, setFieldValue, availableStxBalance]
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
