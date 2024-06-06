import { useCallback } from 'react';

import type { Money } from '@leather-wallet/models';
import { useField } from 'formik';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useToast } from '@app/features/toasts/use-toast';

interface UseSendMaxArgs {
  balance: Money;
  isSendingMax?: boolean;
  onSetIsSendingMax(value: boolean): void;
  sendMaxBalance: string;
  sendMaxFee: string;
}
export function useSendMax({
  balance,
  isSendingMax,
  onSetIsSendingMax,
  sendMaxBalance,
  sendMaxFee,
}: UseSendMaxArgs) {
  const [, _, amountFieldHelpers] = useField('amount');
  const [, __, feeFieldHelpers] = useField('fee');
  const toast = useToast();

  const analytics = useAnalytics();

  return useCallback(() => {
    void analytics.track('select_maximum_amount_for_send');
    if (balance.amount.isLessThanOrEqualTo(0)) {
      toast.error('Zero balance');
      return;
    }
    onSetIsSendingMax(!isSendingMax);
    void feeFieldHelpers.setValue(sendMaxFee);
    void amountFieldHelpers.setValue(sendMaxBalance, false);
    void amountFieldHelpers.setTouched(false, false);
    amountFieldHelpers.setError(undefined);
  }, [
    amountFieldHelpers,
    analytics,
    balance.amount,
    feeFieldHelpers,
    isSendingMax,
    onSetIsSendingMax,
    sendMaxBalance,
    sendMaxFee,
    toast,
  ]);
}
