import { FormikProps } from 'formik';
import BigNumber from 'bignumber.js';
import { useSelectedAsset } from '@common/hooks/use-selected-asset';

import React, { useCallback } from 'react';
import { microStxToStx } from '@common/stacks-utils';
import { FormValues } from '@pages/send-tokens/send-tokens';
import { removeCommas } from '@common/token-utils';
import { STX_TRANSFER_TX_SIZE_BYTES } from '@common/constants';
import { useCurrentAccountAvailableStxBalance } from '@store/accounts/account.hooks';

export function useSendAmountFieldActions({
  setFieldValue,
}: Pick<FormikProps<FormValues>, 'setFieldValue'>) {
  const availableStxBalance = useCurrentAccountAvailableStxBalance();
  const { selectedAsset, balance } = useSelectedAsset();
  const isStx = selectedAsset?.type === 'stx';

  const handleSetSendMax = useCallback(
    (feeRate: number) => {
      if (!selectedAsset || !balance) return;
      if (isStx) {
        const txFee = microStxToStx(
          new BigNumber(feeRate ?? 1).multipliedBy(STX_TRANSFER_TX_SIZE_BYTES).toString()
        );
        const stx = microStxToStx(availableStxBalance || 0).minus(txFee);
        if (stx.isLessThanOrEqualTo(0)) return;
        setFieldValue('amount', stx.toNumber());
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
